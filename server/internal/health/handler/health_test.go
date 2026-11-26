package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/internal/health/service"
	"backend/internal/response"
	"github.com/gin-gonic/gin"
)

type fakeHealthService struct {
	readyStatus service.HealthStatus
	readyErr    error
}

func (s fakeHealthService) Live() service.HealthStatus {
	return service.HealthStatus{Status: "ok"}
}

func (s fakeHealthService) Ready(context.Context) (service.HealthStatus, error) {
	return s.readyStatus, s.readyErr
}

func TestHealthHandlerLive(t *testing.T) {
	gin.SetMode(gin.TestMode)
	handler := NewHealthHandler(fakeHealthService{})
	recorder := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(recorder)
	ctx.Request = httptest.NewRequest(http.MethodGet, "/health", nil)

	handler.Live(ctx)

	if recorder.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusOK)
	}
}

func TestHealthHandlerReadyWhenDatabaseIsUnavailable(t *testing.T) {
	gin.SetMode(gin.TestMode)
	handler := NewHealthHandler(fakeHealthService{readyErr: context.Canceled})
	recorder := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(recorder)
	ctx.Request = httptest.NewRequest(http.MethodGet, "/ready", nil)

	handler.Ready(ctx)

	if recorder.Code != http.StatusServiceUnavailable {
		t.Fatalf("status = %d, want %d", recorder.Code, http.StatusServiceUnavailable)
	}

	var body response.Response
	if err := json.Unmarshal(recorder.Body.Bytes(), &body); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if body.Code != response.CodeServiceUnavailable {
		t.Fatalf("code = %q, want %q", body.Code, response.CodeServiceUnavailable)
	}
}
