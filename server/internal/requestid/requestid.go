// Package requestid carries the per-request correlation ID from the transport
// middleware to everything below it.
package requestid

import "context"

// Header is the inbound and outbound header used to propagate the ID.
const Header = "X-Request-Id"

type contextKey struct{}

func With(ctx context.Context, id string) context.Context {
	return context.WithValue(ctx, contextKey{}, id)
}

func FromContext(ctx context.Context) string {
	id, _ := ctx.Value(contextKey{}).(string)

	return id
}
