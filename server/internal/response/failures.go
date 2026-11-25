package response

import (
	"errors"
	"net/http"

	"backend/internal/service"
)

type failure struct {
	status  int
	message string
}

var failures = map[string]failure{
	CodeValidationFailed:   {http.StatusBadRequest, "validation failed"},
	CodeServiceUnavailable: {http.StatusServiceUnavailable, "service unavailable"},
	CodeInternalError:      {http.StatusInternalServerError, "something went wrong"},
}

type Problem struct {
	Status  int
	Code    string
	Message string
	Fields  map[string]string
}

// From maps a domain error to the failure the client sees.
func From(err error) Problem {
	var validation service.ValidationError
	if errors.As(err, &validation) {
		return Problem{Code: CodeValidationFailed, Fields: validation.Fields}
	}

	return Problem{Code: CodeInternalError}
}

func resolve(problem Problem) Problem {
	entry, known := failures[problem.Code]
	if !known {
		entry = failures[CodeInternalError]
		problem.Code = CodeInternalError
		problem.Fields = nil
	}

	problem.Status = entry.status
	problem.Message = entry.message

	return problem
}
