package router

import (
	"bytes"
	"context"
	"encoding/json"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"backend/internal/config"
	"backend/internal/response"
	"github.com/gin-gonic/gin"
)

type fakeHealthRepository struct{ err error }

func (r fakeHealthRepository) Ping(context.Context) error { return r.err }

func TestRouterRequestPipeline(t *testing.T) {
	gin.SetMode(gin.TestMode)

	var logs bytes.Buffer
	previous := slog.Default()
	slog.SetDefault(slog.New(slog.NewJSONHandler(&logs, nil)))
	t.Cleanup(func() { slog.SetDefault(previous) })

	engine, err := New(fakeHealthRepository{err: context.Canceled}, config.ServerConfig{Mode: gin.TestMode})
	if err != nil {
		t.Fatalf("New() error = %v", err)
	}

	health := httptest.NewRecorder()
	engine.ServeHTTP(health, httptest.NewRequest(http.MethodGet, "/health", nil))

	if health.Code != http.StatusOK {
		t.Fatalf("/health status = %d, want 200", health.Code)
	}
	if strings.TrimSpace(logs.String()) != "" {
		t.Fatalf("healthy probe was logged: %s", logs.String())
	}
	if health.Header().Get("X-Request-Id") == "" {
		t.Fatal("/health did not echo X-Request-Id")
	}

	logs.Reset()
	ready := httptest.NewRecorder()
	engine.ServeHTTP(ready, httptest.NewRequest(http.MethodGet, "/ready", nil))

	if ready.Code != http.StatusServiceUnavailable {
		t.Fatalf("/ready status = %d, want 503", ready.Code)
	}

	var body response.Response
	if err := json.Unmarshal(ready.Body.Bytes(), &body); err != nil {
		t.Fatalf("decode /ready: %v", err)
	}
	if body.Success || body.Code != response.CodeServiceUnavailable || body.Error == "" {
		t.Fatalf("/ready body = %+v, want a coded service_unavailable failure", body)
	}

	lines := strings.Split(strings.TrimSpace(logs.String()), "\n")
	if len(lines) != 2 {
		t.Fatalf("failing probe logged %d lines, want 2: %s", len(lines), logs.String())
	}

	var requestLine map[string]any
	for _, line := range lines {
		var record map[string]any
		if err := json.Unmarshal([]byte(line), &record); err != nil {
			t.Fatalf("decode log line: %v", err)
		}
		if record["msg"] == "request completed" {
			requestLine = record
		}
	}
	if requestLine == nil {
		t.Fatalf("no request completed line: %s", logs.String())
	}
	if requestLine["level"] != "ERROR" {
		t.Errorf("503 level = %v, want ERROR", requestLine["level"])
	}
	if requestLine["request_id"] == "" || requestLine["request_id"] != ready.Header().Get("X-Request-Id") {
		t.Errorf("request_id = %v, header = %q", requestLine["request_id"], ready.Header().Get("X-Request-Id"))
	}
	if requestLine["path"] != "/ready" {
		t.Errorf("path = %v, want /ready", requestLine["path"])
	}
}
