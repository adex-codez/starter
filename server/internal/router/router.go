package router

import (
	"backend/internal/config"
	"backend/internal/health/handler"
	"backend/internal/health/repository"
	"backend/internal/health/service"
	"backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func New(db repository.HealthRepository, cfg config.ServerConfig) (*gin.Engine, error) {
	gin.SetMode(cfg.Mode)

	router := gin.New()
	if err := router.SetTrustedProxies(nil); err != nil {
		return nil, err
	}
	// RequestID runs outermost so the recovery and request loggers can read the
	// correlation ID assigned to the request they are handling.
	router.Use(middleware.RequestID(), middleware.Recovery(), middleware.Logger())

	healthService := service.NewHealthService(db)
	h := handler.NewHealthHandler(healthService)
	router.GET("/health", h.Live)
	router.GET("/ready", h.Ready)

	return router, nil
}
