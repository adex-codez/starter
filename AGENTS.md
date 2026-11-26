## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the five canonical triage labels without aliases. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repository. See `docs/agents/domain.md`.

### Go feature structure

When adding a Go feature, group its code under `server/internal/<feature>/` and keep transport, application behavior, and persistence in separate packages:

```text
server/internal/<feature>/
  handler/       HTTP handlers and API request/response DTOs
  service/       feature behavior and use cases
  repository/    persistence interfaces and adapters
```

Add only the directories the feature needs. Keep feature-specific code with its feature. Put shared app code under `server/internal/` in a focused package when multiple features use it. Use `pkg/` only for packages intended for import by other Go modules.

Define request and response DTOs in the feature's `handler` package when the API shape differs from service types, needs validation or serialization rules, or should remain stable as service internals change. Map DTOs to and from service inputs and outputs in the handler. For a simple endpoint whose API and service data have the same shape, reuse the service type instead of adding a duplicate DTO.

Wire each feature's handler, service, and repository at the application composition point. Keep dependencies flowing from handler to service to repository.
