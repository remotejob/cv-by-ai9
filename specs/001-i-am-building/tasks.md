# Tasks: Modern DevOps Portfolio Website

**Input**: Design documents from `/specs/001-i-am-building/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Phase 3.1: Setup
- [ ] T001 Create `frontend/` Next.js app per plan at repo root
- [ ] T002 Initialize TypeScript/Tailwind/ESLint with Next.js defaults in `frontend/`
- [ ] T003 Configure static export in `frontend/next.config.js` with `output: 'export'`
- [ ] T004 [P] Install UI deps in `frontend/` (`@shadcn/ui`, `@radix-ui/react-icons`, `class-variance-authority`, `tailwind-merge`, `lucide-react`)
- [ ] T005 Initialize shadcn in `frontend/` and add base components
- [ ] T006 [P] Configure base Tailwind theme tokens to match Figma in `frontend/tailwind.config.ts`
- [ ] T007 Create app layout, nav, footer in `frontend/app/(site)/layout.tsx` and `frontend/components`
- [ ] T008 Prepare content dirs `frontend/content/{projects,knowledge}`

## Phase 3.2: Tests First (TDD)
- [ ] T009 Add Playwright setup in `frontend/` and base e2e config
- [ ] T010 [P] Contract test Project schema validation in `frontend/tests/contract/project.schema.spec.ts` using `specs/001-i-am-building/contracts/project.schema.json`
- [ ] T011 [P] Contract test KnowledgeEntry schema validation in `frontend/tests/contract/knowledge-entry.schema.spec.ts` using `specs/001-i-am-building/contracts/knowledge-entry.schema.json`
- [ ] T012 [P] Integration test Home shows exactly 3 featured projects in `frontend/tests/e2e/home.featured.spec.ts`
- [ ] T013 [P] Integration test Projects list paginates 50 items in `frontend/tests/e2e/projects.list.spec.ts`
- [ ] T014 [P] Integration test Project detail by slug in `frontend/tests/e2e/projects.detail.spec.ts`
- [ ] T015 [P] Integration test Knowledge filters by tag/category in `frontend/tests/e2e/knowledge.filters.spec.ts`
- [ ] T016 [P] Integration test Contact page mailto and confirmation in `frontend/tests/e2e/contact.spec.ts`

## Phase 3.3: Core Implementation (after tests fail)
- [ ] T017 [P] Define TypeScript types for Project and KnowledgeEntry in `frontend/types/content.ts`
- [ ] T018 [P] Implement JSON loaders and schema validators in `frontend/lib/content.ts`
- [ ] T019 Create Home page with hero and featured projects in `frontend/app/(site)/page.tsx`
- [ ] T020 Implement Projects list with pagination/lazy-load in `frontend/app/(site)/projects/page.tsx`
- [ ] T021 Implement Project detail route in `frontend/app/(site)/projects/[slug]/page.tsx`
- [ ] T022 Implement Knowledge page with filters in `frontend/app/(site)/knowledge/page.tsx`
- [ ] T023 Implement Contact page with mailto and confirmation in `frontend/app/(site)/contact/page.tsx`
- [ ] T024 [P] Add SEO metadata utilities and per-page meta in `frontend/app/*/head.tsx` or metadata exports
- [ ] T025 [P] Add responsive images for project cards in `frontend/components/project-card.tsx`
- [ ] T026 Ensure a11y semantics, alt text, and contrast across pages
- [ ] T027 [P] Add 404 and empty-state components in `frontend/app/not-found.tsx` and `frontend/components/empty-state.tsx`

## Phase 3.4: Validation and Tooling
- [ ] T028 [P] Add unit tests for loaders/utils in `frontend/tests/unit/content.spec.ts`
- [ ] T029 Configure lint, typecheck, and CI scripts in `frontend/package.json` and root CI
- [ ] T030 [P] Validate JSON content against schemas in a script `frontend/scripts/validate-content.ts`
- [ ] T031 Run Lighthouse locally and optimize for ≥90
- [ ] T032 Export static site and verify all routes locally `frontend/out/`

## Parallel Execution Notes
- Marked [P] tasks touch different files or are independent
- Example parallel group: T010, T011, T012, T013, T014, T015, T016

## Dependencies
- Setup (T001–T008) precedes tests and implementation
- Tests (T009–T016) must exist and fail before implementation (T017–T027)
- Types/loaders (T017–T018) precede pages (T019–T023)
- Validation/tooling (T028–T032) after core pages
