package service

import "errors"

var ErrValidation = errors.New("validation failed")

// ValidationError carries per-field messages behind ErrValidation so the
// transport can report them without parsing error strings.
type ValidationError struct {
	Fields map[string]string
}

func (e ValidationError) Error() string { return "validation failed" }

func (e ValidationError) Is(target error) bool { return target == ErrValidation }
