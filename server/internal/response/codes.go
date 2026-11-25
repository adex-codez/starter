package response

// The machine-readable failure codes the API returns. Clients branch on these,
// so the values are part of the wire contract: renaming one is a breaking
// change, and adding one obliges the client to handle it.
//
// This file is the only place a code is written down. Every exported string
// constant whose name starts with Code is a code.
const (
	CodeValidationFailed   = "validation_failed"
	CodeServiceUnavailable = "service_unavailable"
	CodeInternalError      = "internal_error"
)
