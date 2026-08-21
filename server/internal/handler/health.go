package handler

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

type pinger interface {
	Ping(context.Context) error
}

type HealthHandler struct {
	db pinger
}

func NewHealthHandler(db pinger) *HealthHandler {
	return &HealthHandler{db: db}
}

func (h *HealthHandler) Live(c *gin.Context) {
	Success(c, gin.H{"status": "ok"})
}

func (h *HealthHandler) Ready(c *gin.Context) {
	if err := h.db.Ping(c.Request.Context()); err != nil {
		Error(c, http.StatusServiceUnavailable, "service unavailable")
		return
	}

	Success(c, gin.H{"status": "ready", "database": "ok"})
}
