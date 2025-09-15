# Implementation Plan: Modern DevOps Portfolio Website

**Branch**: `001-i-am-building` | **Date**: 2025-09-15 | **Spec**: /home/juno/repos/gitlab.com/jobcv/cv-by-ai9/specs/001-i-am-building/spec.md
**Input**: Feature specification from `/specs/001-i-am-building/spec.md`

## Summary
Build a sleek, responsive, static Next.js portfolio with: landing page showing exactly 3 featured projects; projects page listing 50 mocked projects with pagination/lazy-load; knowledge page with categorized/tagged entries and basic filter; contact page with working mailto and confirmation. No databases; all content embedded. Apply the provided Figma design via Framelink_Figma_MCP and shadcn/ui components.

## Technical Context
**Language/Version**: TypeScript, Node 18, Next.js 14 (App Router, static export)
**Primary Dependencies**: next, react, tailwindcss, @shadcn/ui
**Storage**: None (embedded JSON/MDX content files)
**Testing**: Playwright (E2E), Vitest (unit)
**Target Platform**: Static hosting (static export)
**Project Type**: web
**Performance Goals**: Lighthouse ≥90 on key pages; fast TTI via static assets
**Constraints**: Static-only (no server runtime), a11y basics, basic SEO (title/meta/OG)
**Scale/Scope**: 50 projects, categorized knowledge entries, 4 core routes

## Constitution Check
**Simplicity**
- Projects: 1 (frontend static site)
- Using framework directly: yes
- Single data model: yes
- Avoiding patterns: yes

**Architecture**
- Frontend-only; no backend libraries or CLIs required for this feature
- Libraries listed: next (SSR/SSG), tailwind + @shadcn/ui (UI)

**Testing (NON-NEGOTIABLE)**
- TDD acknowledged; E2E scenarios derived from acceptance criteria
- Contract tests target content schemas and route contracts

**Observability**
- Console error surfaces; static build warnings addressed in CI

**Versioning**
- Planned initial version: 0.1.0

## Project Structure
### Documentation (this feature)
```
specs/001-i-am-building/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (future implementation)
```
frontend/  # Next.js app (static export)
```

## Phase 0: Outline & Research
Completed. See research.md for technology choices, rationale, and alternatives.

## Phase 1: Design & Contracts
Completed. See data-model.md and contracts/ for schemas and routes; quickstart.md for setup and validation steps.

## Phase 2: Task Planning Approach
Completed. See tasks.md for ordered tasks, with [P] for parallelizable items.

## Complexity Tracking
| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|

## Progress Tracking
**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented
