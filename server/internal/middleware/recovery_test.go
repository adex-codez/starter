package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestRecoveryLogsRequestContextAndStack(t *testing.T) {
	gin.SetMode(gin.TestMode)

	logs := captureLogs(t)

	engine := gin.New()
	engine.Use(RequestID(), Recovery(), Logger())
	engine.GET("/boom", func(*gin.Context) {
		panic("something broke")
	})

	recorder := httptest.NewRecorder()
	engine.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/boom", nil))

	if recorder.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusInternalServerError)
	}

	record := decodeLine(t, logs)
	if record["msg"] != "panic recovered" {
		t.Fatalf("msg = %v, want panic recovered", record["msg"])
	}

	// A panic unwinds the chain, so the recovery line is the only one emitted.
	if record["path"] != "/boom" {
		t.Fatalf("path = %v, want /boom", record["path"])
	}
	if _, ok := record["stack"].(string); !ok {
		t.Fatalf("panic log line missing stack: %v", record)
	}
}
