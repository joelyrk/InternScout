# ADR 0004: Frontend API connection

- Status: Accepted
- Date: 2026-07-19

## Context

Phase 0.4 must prove that the Next.js frontend can communicate safely with the FastAPI
backend before persistence or authentication is introduced. The health response crosses a network
boundary and therefore cannot be trusted solely because both applications use typed source code.

## Decision

- Configure the browser-visible API base URL with `NEXT_PUBLIC_INTERNSCOUT_API_URL`.
- Fetch `GET /health` directly from the browser on a dedicated `/development` page so the actual
  cross-origin development path is exercised.
- Validate the health payload at runtime and reject unknown fields or invalid values.
- Apply a three-second timeout and map configuration, timeout, network, HTTP, and response-schema
  failures to stable, readable frontend messages.
- Configure FastAPI CORS from `INTERNSCOUT_CORS_ORIGINS`, allowing credentials and only the
  methods and headers currently required by the health check.
- Keep the small health contract local to each application for now. Shared or generated API types
  will be introduced when product endpoints create enough contracts to justify that tooling.

## Consequences

- Developers can verify frontend-to-backend connectivity without introducing database or
  authentication dependencies.
- Deployment environments must configure both the public API URL and their exact allowed frontend
  origins.
- Raw backend error bodies are neither trusted nor rendered by the frontend.
- Changing the health response requires updating the frontend validator and its contract tests.
