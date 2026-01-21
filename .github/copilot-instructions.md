<!-- Copilot instructions for AI coding agents working on this repo -->
# Repo overview (quick)
- Framework: Next.js app-dir (app/) using TypeScript and Tailwind via PostCSS.
- Key entry points: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`.
- Primary scripts (see `package.json`):
  - `npm run dev` — runs `next dev` (development server)
  - `npm run build` — runs `next build`
  - `npm run start` — runs `next start`
  - `npm run lint` — runs `eslint`

# Architecture & patterns to preserve
- App directory layout: UI and routes live under `app/` (React Server Components + client components as needed). Edit `app/page.tsx` for the main page.
- Fonts: uses `next/font` (see `app/layout.tsx`) — prefer the same API when adding fonts.
- Global styles: `app/globals.css` imports Tailwind (`@import "tailwindcss"`) and defines CSS custom properties for light/dark theming. Keep theme variables consistent (`--background`, `--foreground`, `--font-geist-sans`, `--font-geist-mono`).
- TypeScript: `tsconfig.json` is strict; respect types and `paths` alias `@/*` when adding imports.

# Conventions for edits
- Prefer changes inside `app/` for UI and layout updates; avoid creating a parallel `pages/` tree.
- Keep server-client boundaries explicit: only use browser-only APIs in client components. If converting a file to a client component, add `'use client'` at the top.
- Use Next.js Image component (`next/image`) where appropriate (already used in `app/page.tsx`).
- Styling: use Tailwind utility classes in JSX; put global tokens and Tailwind import in `app/globals.css`.

# Build, test, and debug notes
- Run locally: `npm ci && npm run dev` then open http://localhost:3000.
- Linting: run `npm run lint`. The project uses `eslint-config-next` — follow its rules.
- Type errors: TypeScript is strict with `noEmit: true` — fix types rather than suppressing.

# Integration & external dependencies
- Next.js (v16), React (v19) and Tailwind (`tailwindcss`) are core dependencies. Avoid adding heavy client-only libraries unless necessary for UX.
- Deploy: project is set up for Vercel (default Next.js deployment). Keep `next.config.ts` changes minimal and documented in PRs.

# Examples (what to edit and how)
- To change page content: edit `app/page.tsx` and preserve the existing Tailwind classes and `Image` usage.
- To add a new route: create `app/<route>/page.tsx` following the same patterns (layout optional).
- To add global CSS tokens: update `app/globals.css` and keep the dark-mode overrides under `@media (prefers-color-scheme: dark)`.

# PR & commit guidance for AI-generated changes
- Keep commits small and focused (one feature/fix per PR).
- Explain why any `next.config.ts` or `tsconfig.json` change is needed; these affect build and type behavior across the repo.
- When adding runtime dependencies, prefer ones that support server and client-side rendering or document limitations in the PR.

# When uncertain
- If a change requires adding runtime infra (API routes, databases, auth), ask the human maintainer — this repo currently contains only the frontend skeleton.
- If you need to run the app with a specific Node version or environment variables, request them before making large changes.

Please review these instructions — tell me any missing details or preferred workflows to incorporate.