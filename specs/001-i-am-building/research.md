# Research

## Decisions
- Framework: Next.js 14 App Router with static export (no server runtime)
- UI: Tailwind CSS with shadcn/ui components for consistent, accessible styling
- Design source: Provided Figma file via Framelink_Figma_MCP to align typography, spacing, and components
- Data: Embedded JSON (or MDX) for 50 projects and knowledge entries; curated 3 featured projects via flag
- Routing: Static routes for /, /projects (paginated), /projects/[slug], /knowledge (filters), /contact
- SEO: Per-page title/meta/OG placeholders; sitemap and robots via static files
- Accessibility: Semantic structure, alt text, color contrast compliance
- Performance: Static assets, image optimization, minimal JS on initial load

## Rationale
- Static export matches no-database constraint and keeps hosting simple and fast
- shadcn/ui accelerates consistent UI without heavy design system overhead
- JSON/MDX content keeps data local, versioned, and deterministic for mock content

## Alternatives Considered
- SSG with content from CMS (rejected: violates no-external-data constraint)
- CSR-only React SPA (rejected: weaker SEO and slower FCP)
- Design from scratch (rejected: slower; Figma provided)
