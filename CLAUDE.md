# Full Next.js Template

General-purpose Next.js 16 template. No specific domain yet.

## Stack

Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, shadcn/ui (base-vega, Phosphor icons), Redux Toolkit, React Query, pnpm

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build (run to verify changes)
- `pnpm lint` — eslint check

## Folder Structure

```
app/                    # Next.js routes & layouts
components/
  ui/                   # shadcn/ui components (do not edit manually)
  shared/               # Reusable components across features
features/
  [name]/
    components/         # Feature-specific components
    hooks/              # Feature-specific hooks
    services/           # React Query hooks + API calls
    types/              # Feature-specific types
    store/              # Redux slice (only if needed)
providers/              # App-level context providers
services/               # Shared API layer (base client, query keys)
hooks/                  # Shared hooks
lib/                    # General utilities
store/                  # Redux store config
types/                  # Shared TypeScript types
constants/              # App-wide constants
```

## Naming

- Files: `kebab-case.ts` (e.g., `use-auth.ts`, `api-client.ts`)
- Components: `PascalCase` function name, `kebab-case` file
- Hooks: `use-` prefix (e.g., `use-redux.ts`)
- Imports: always use `@/` alias
- Exports: named exports. Default export only for page/layout files.

## Components

- Server components by default. Add `'use client'` only when needed.
- Use shadcn from `@/components/ui/` — never modify ui/ files directly.
- Shared components go in `components/shared/`.
- Feature components go in `features/[name]/components/`.

## State Management

- **Server state**: React Query (always). Fetch, cache, sync with API.
- **Local UI state**: React useState/useReducer.
- **Cross-feature client state**: Redux Toolkit (rare). Never store server data in Redux.

## API Layer

- Base client: `services/api-client.ts` (native fetch wrapper)
- Query keys: `services/query-keys.ts` — factory pattern `[feature, resource, params?]`
- Feature services: `features/[name]/services/` — export React Query hooks
- Pattern: service function -> `useQuery`/`useMutation` hook -> component

## Styling

- Tailwind utilities only. No custom CSS unless absolutely necessary.
- Use `cn()` from `@/lib/utils` for conditional classes.
- CSS variables defined in `app/globals.css`.
- Mobile-first approach.

## Git

Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`

## Claude Behavior

- Be concise. No verbose JSDoc on obvious code.
- YAGNI — don't create abstractions until needed.
- Always follow the approved plan. Do not deviate.
- Run `pnpm build` after changes to verify.
- Keep this file under 120 lines.
- Conversation language: Turkish. Code/comments: English.
