<!--
## Sync Impact Report
- Version change: 0.0.0 → 1.0.0
- Added sections: All (new constitution)
- Principles defined:
  - I. Specification-First Development
  - II. Quality & Validation Standards
  - III. Documentation & Traceability
  - IV. Development Principles
  - V. Tech Stack & Tooling
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (Constitution Check section compatible)
  - .specify/templates/spec-template.md ✅ (Requirements/Success Criteria aligned)
  - .specify/templates/tasks-template.md ✅ (Test-first workflow aligned)
- Follow-up TODOs: None
-->

# Calculator Constitution

## Core Principles

### I. Specification-First Development

All meaningful requirements MUST be captured in specification artifacts before implementation.
Specifications MUST describe user intent, acceptance criteria, edge cases, and expected behavior in clear, testable terms.
Specs are the single source of truth during planning and implementation phases.
Specs MUST be reviewed and approved prior to `/sp.plan`.

### II. Quality & Validation Standards

Tests are written before or alongside implementation (TDD).
Every feature spec MUST include acceptance tests that can be automated.
All tests MUST pass before merging or releasing.
Maintain at least 80% code coverage across the codebase.

### III. Documentation & Traceability

All architectural decisions MUST be captured via ADRs (with rationale and alternatives).
Specs, plans, and ADRs are stored in version control and linked to tasks.
Changes to specs MUST be documented with updated ADRs to prevent regression and drift.

### IV. Development Principles

Prioritize clarity, modularity, and maintainability.
Use TypeScript for type safety, with strict linting and formatting rules.
Code should express intent clearly and be easily testable.

### V. Tech Stack & Tooling

Official stack: Node.js, npm, Next.js@15.3.6, React, TypeScript.
UI libraries: TailwindCSS, React Hook Form.
Runtime validation via Zod for runtime correctness.
CI MUST enforce tests, linting, and spec validation checks.

## Governance

The constitution supersedes all other development practices.
Amendments require:
1. Documentation of the proposed change
2. Team approval
3. Migration plan (if backward incompatible)

All PRs and code reviews MUST verify compliance with these principles.
Complexity beyond what is strictly necessary MUST be justified with documentation.

**Version**: 1.0.0 | **Ratified**: 2026-01-09 | **Last Amended**: 2026-01-09
