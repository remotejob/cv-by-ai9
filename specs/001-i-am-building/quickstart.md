# Quickstart

1. Prerequisites: Node.js 18+, pnpm or npm
2. Create app: `npx create-next-app@latest frontend --ts --eslint --tailwind --app` (choose no experimental features)
3. Static export: set `output: 'export'` in next.config.js; avoid dynamic server features
4. Install UI deps: `cd frontend && pnpm add @radix-ui/react-icons class-variance-authority tailwind-merge lucide-react @shadcn/ui`
5. Initialize shadcn: `pnpm dlx shadcn-ui@latest init` and add needed components
6. Add content files under `frontend/content/{projects,knowledge}` matching schemas in `specs/001-i-am-building/contracts/`
7. Implement pages: `/`, `/projects`, `/projects/[slug]`, `/knowledge`, `/contact`
8. Validate a11y/SEO: headings order, alt text, meta tags
9. Run locally: `pnpm dev`; build/export: `pnpm build && pnpm export`
10. E2E smoke: add Playwright and validate acceptance scenarios
