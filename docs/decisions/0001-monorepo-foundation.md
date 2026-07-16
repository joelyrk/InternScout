# ADR 0001: Monorepo foundation

- Status: Accepted
- Date: 2026-07-16

## Context

InternScout will contain a Next.js frontend, a FastAPI backend, shared packages, and independently runnable workers. Phase 0.1 needs shared tooling without prematurely choosing framework-specific dependencies that belong to later phases.

## Decision

- Use npm workspaces from the repository root because npm ships with the selected Node.js runtime and requires no separate package-manager bootstrap.
- Target Node.js 24+, with Node.js 24 used in CI.
- Reserve `apps`, `packages`, and `workers` workspace boundaries now while leaving framework initialization to its planned phase.
- Provide local PostgreSQL and Redis services through Docker Compose, bound to loopback and configured from environment variables.
- Run a dependency-free foundation verification script and Node test in CI.

## Consequences

- A fresh clone can install and validate without global JavaScript tooling beyond Node.js and npm.
- Frontend and backend dependency choices remain reviewable Phase 0.2 and Phase 0.3 changes.
- PostgreSQL and Redis images are placeholders until persistence and background processing are implemented.

