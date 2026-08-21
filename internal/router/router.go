package router

import (
	"context"

	"backend/internal/config"
	"backend/internal/handler"
	"backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

type pinger interface {
	Ping(context.Context) error
}

func New(db pinger, cfg config.ServerConfig) (*gin.Engine, error) {
	gin.SetMode(cfg.Mode)

	router := gin.New()
	if err := router.SetTrustedProxies(nil); err != nil {
		return nil, err
	}
	router.Use(middleware.Recovery(), middleware.Logger())

	health := handler.NewHealthHandler(db)
	router.GET("/health", health.Live)
	router.GET("/ready", health.Ready)

	return router, nil
}
