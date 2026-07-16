# ADR 0002: Frontend foundation

- Status: Accepted
- Date: 2026-07-16

## Context

Phase 0.2 needs a navigable, accessible frontend skeleton that can grow into authenticated profile, evidence, job, resume, and application workflows. It must remain useful without introducing backend behavior or synthetic candidate claims.

## Decision

- Use stable Next.js 16 with the App Router, React Server Components by default, and strict TypeScript.
- Use Tailwind CSS 4 through its PostCSS integration for local, utility-first styling.
- Use a small set of repository-owned components for repeated layout, navigation, section, and empty-state patterns; do not add a component library yet.
- Use ESLint with Next.js Core Web Vitals and TypeScript rules, plus Prettier for formatting.
- Use Vitest and Testing Library for synchronous component behavior. Reserve rendered end-to-end testing for a later phase when full user workflows exist.
- Use system fonts so local and CI builds do not depend on downloading remote font assets.
- Keep Next.js-generated declarations out of version control and run `next typegen` before standalone TypeScript checks.

## Consequences

- All five primary routes build as static pages and share an accessible, responsive application shell.
- The UI contains only explicit zero states and roadmap language; it does not imply stored candidate or job data.
- Client JavaScript is limited to active-route navigation and the error boundary.
- Authentication, API calls, forms, persistence, and product actions remain in their planned phases.
