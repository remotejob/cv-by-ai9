# cv-by-ai9 Constitution

## Core Principles

### I. Static-First
- All pages are built to static HTML/CSS/JS assets.
- No server-side execution at runtime; host on CDN/static storage.

### II. Minimal JS, Progressive Enhancement
- Core content usable without JavaScript; enhancements are optional.
- Client-side routing only if essential; avoid heavy frameworks.

### III. Performance and Accessibility
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95 on key pages.
- Optimize images, minify assets, use system fonts or preload fonts.

### IV. Security and Privacy
- No secrets committed; build-time config only.
- Configure CSP and SRI for third-party assets; pin and scan dependencies.

### V. Versioning and Simplicity
- Semantic versioning; prefer small, readable changes.
- Avoid unnecessary complexity; default to plain HTML/CSS.

## Standards
- Stack: HTML, CSS, vanilla JS; optional SSG that outputs static files only.
- Build: Single command outputs to dist/ with content-hashed filenames.
- Assets: First-party by default; third-party scripts require review.

## Workflow
- Use feature branches; all changes via pull requests with review.
- CI: build, link check, format check, and Lighthouse budget verification.
- Deploy: Only dist/ artifacts; production releases are tagged.

## Governance
- This constitution governs technical decisions for the static site.
- Amend via pull request with rationale and migration notes; maintainer approval required.

## Development
- Project oriented on Cloudflare deployment.
- All new components services etc.. as well oriented on Cloudflare.

Version: 1.0.0 | Ratified: 2025-09-15 | Last Amended: 2025-09-15
