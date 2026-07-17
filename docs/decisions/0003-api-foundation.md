# ADR 0003: API foundation

- Status: Accepted
- Date: 2026-07-17

## Context

Phase 0.3 needs a minimal Python service that is independently runnable and testable before database, authentication, or frontend integration work begins.

## Decision

- Use Python 3.12 as the minimum and CI runtime.
- Use FastAPI with Pydantic response models and Pydantic Settings for validated `INTERNSCOUT_` environment variables.
- Manage and lock the API environment with uv in `apps/api`.
- Use a small application factory so tests can inject isolated settings without mutating process-global configuration.
- Return one stable error envelope for application, validation, HTTP, and unexpected failures.
- Sanitize validation errors so request input is never echoed in error details.
- Use Ruff, Black, Pyright, and pytest as independent quality gates.

## Consequences

- The API can be developed and validated without PostgreSQL or Redis.
- Production disables interactive documentation, while health, readiness, and OpenAPI remain available.
- Dependency changes require updating and committing `apps/api/uv.lock`.
- Database readiness checks, CORS, correlation IDs, and frontend communication remain in their planned phases.

