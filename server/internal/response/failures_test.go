package response

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"

	"backend/internal/requestid"
	"backend/internal/service"
	"github.com/gin-gonic/gin"
)

func parseCodes(t *testing.T) []string {
	t.Helper()

	file, err := parser.ParseFile(token.NewFileSet(), "codes.go", nil, 0)
	if err != nil {
		t.Fatalf("parse codes.go: %v", err)
	}

	var codes []string
	for _, decl := range file.Decls {
		gen, ok := decl.(*ast.GenDecl)
		if !ok || gen.Tok != token.CONST {
			continue
		}
		for _, spec := range gen.Specs {
			value, ok := spec.(*ast.ValueSpec)
			if !ok {
				continue
			}
			for i, name := range value.Names {
				if !ast.IsExported(name.Name) || !strings.HasPrefix(name.Name, "Code") {
					continue
				}
				if i >= len(value.Values) {
					continue
				}
				literal, ok := value.Values[i].(*ast.BasicLit)
				if !ok || literal.Kind != token.STRING {
					continue
				}
				code, err := strconv.Unquote(literal.Value)
				if err != nil {
					t.Fatalf("unquoting %s: %v", name.Name, err)
				}
				codes = append(codes, code)
			}
		}
	}

	if len(codes) == 0 {
		t.Fatal("parsed no codes from codes.go")
	}

	return codes
}

func TestEveryCodeHasAFailure(t *testing.T) {
	for _, code := range parseCodes(t) {
		entry, ok := failures[code]
		if !ok {
			t.Errorf("code %q has no entry in the failures table", code)
			continue
		}
		if entry.status < 400 || entry.status > 599 {
			t.Errorf("code %q maps to status %d, want a 4xx or 5xx", code, entry.status)
		}
		if entry.message == "" {
			t.Errorf("code %q has no message", code)
		}
	}
}

func TestCodesAndFailuresStayInStep(t *testing.T) {
	codes := parseCodes(t)
	if len(failures) != len(codes) {
		t.Fatalf("failures table has %d entries, codes.go defines %d", len(failures), len(codes))
	}
}

func TestFromMapsValidationError(t *testing.T) {
	fields := map[string]string{"email": "email must be a valid address"}

	problem := resolve(From(service.ValidationError{Fields: fields}))
	if problem.Code != CodeValidationFailed {
		t.Errorf("code = %q, want %q", problem.Code, CodeValidationFailed)
	}
	if problem.Status != http.StatusBadRequest {
		t.Errorf("status = %d, want %d", problem.Status, http.StatusBadRequest)
	}
	if problem.Fields["email"] != fields["email"] {
		t.Errorf("fields = %v, want %v", problem.Fields, fields)
	}
}

func TestFromMapsWrappedValidationError(t *testing.T) {
	err := fmt.Errorf("sign up: %w", service.ValidationError{Fields: map[string]string{"username": "bad"}})

	problem := resolve(From(err))
	if problem.Code != CodeValidationFailed {
		t.Fatalf("code = %q, want %q", problem.Code, CodeValidationFailed)
	}
}

func TestFromMapsUnknownErrorToInternalError(t *testing.T) {
	problem := resolve(From(errors.New("dial tcp: connection refused")))
	if problem.Code != CodeInternalError {
		t.Fatalf("code = %q, want %q", problem.Code, CodeInternalError)
	}
	if problem.Status != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d", problem.Status, http.StatusInternalServerError)
	}
}

func TestUnknownCodeCollapsesToInternalError(t *testing.T) {
	problem := resolve(Problem{Code: "not_a_code", Fields: map[string]string{"email": "leak"}})
	if problem.Code != CodeInternalError {
		t.Fatalf("code = %q, want %q", problem.Code, CodeInternalError)
	}
	if problem.Status != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d", problem.Status, http.StatusInternalServerError)
	}
	if problem.Fields != nil {
		t.Fatalf("fields = %v, want nil so no detail leaks", problem.Fields)
	}
}

func TestFailWritesTheCodedFailure(t *testing.T) {
	gin.SetMode(gin.TestMode)

	engine := gin.New()
	engine.GET("/thing", func(c *gin.Context) {
		Fail(c, service.ValidationError{Fields: map[string]string{"email": "email must be a valid address"}})
	})

	recorder := httptest.NewRecorder()
	engine.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/thing", nil))

	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusBadRequest)
	}

	var body Response
	if err := json.Unmarshal(recorder.Body.Bytes(), &body); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if body.Code != CodeValidationFailed {
		t.Errorf("code = %q, want %q", body.Code, CodeValidationFailed)
	}
	if body.Error != failures[CodeValidationFailed].message {
		t.Errorf("message = %q, want the table message", body.Error)
	}
	if body.Fields["email"] != "email must be a valid address" {
		t.Errorf("fields = %v, want the per-field message", body.Fields)
	}
}

func TestFailCodeWritesTheTableMessage(t *testing.T) {
	gin.SetMode(gin.TestMode)

	engine := gin.New()
	engine.GET("/thing", func(c *gin.Context) {
		FailCode(c, CodeServiceUnavailable)
	})

	recorder := httptest.NewRecorder()
	engine.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/thing", nil))

	if recorder.Code != http.StatusServiceUnavailable {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusServiceUnavailable)
	}

	var body Response
	if err := json.Unmarshal(recorder.Body.Bytes(), &body); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if body.Code != CodeServiceUnavailable {
		t.Errorf("code = %q, want %q", body.Code, CodeServiceUnavailable)
	}
	if body.Error != failures[CodeServiceUnavailable].message {
		t.Errorf("message = %q, want the table message", body.Error)
	}
}

func TestValidationWritesFields(t *testing.T) {
	gin.SetMode(gin.TestMode)

	engine := gin.New()
	engine.GET("/thing", func(c *gin.Context) {
		Validation(c, map[string]string{"email": "email must be a valid address"})
	})

	recorder := httptest.NewRecorder()
	engine.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/thing", nil))

	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusBadRequest)
	}

	var body Response
	if err := json.Unmarshal(recorder.Body.Bytes(), &body); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if body.Code != CodeValidationFailed {
		t.Errorf("code = %q, want %q", body.Code, CodeValidationFailed)
	}
	if body.Fields["email"] != "email must be a valid address" {
		t.Errorf("fields = %v, want the per-field message", body.Fields)
	}
}

func TestFailLogs5xxWithRequestID(t *testing.T) {
	gin.SetMode(gin.TestMode)

	var logged bytes.Buffer
	previous := slog.Default()
	slog.SetDefault(slog.New(slog.NewJSONHandler(&logged, nil)))
	t.Cleanup(func() { slog.SetDefault(previous) })

	engine := gin.New()
	engine.GET("/thing", func(c *gin.Context) {
		Fail(c, errors.New("dial tcp: connection refused"))
	})

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, "/thing", nil)
	request = request.WithContext(requestid.With(request.Context(), "req-123"))
	engine.ServeHTTP(recorder, request)

	line := logged.String()
	for _, want := range []string{
		`"request_id":"req-123"`,
		`"status":500`,
		`"code":"internal_error"`,
		"dial tcp: connection refused",
	} {
		if !bytes.Contains([]byte(line), []byte(want)) {
			t.Errorf("log line is missing %q: %s", want, line)
		}
	}
}
