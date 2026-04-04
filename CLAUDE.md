# Full Next.js Template

General-purpose Next.js 16 template. No specific domain yet.

## Stack

Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, shadcn/ui (base-vega, Phosphor icons), Redux Toolkit, React Query, pnpm

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build (run to verify changes)
- `pnpm lint` — eslint check
- `bash scripts/claude-onboarding.sh` — setup Claude memory (run once after clone)

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
scripts/                # Dev scripts (onboarding, etc.)
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
- **Before creating UI**: MUST read `components/shared/REGISTRY.md` and `PATTERNS.md` — never use raw HTML when a shadcn or shared component exists.
- Used in 1 place → `features/[name]/components/`. Used in 2+ places → `components/shared/`.
- When adding to shared: update `REGISTRY.md` with name, path, props, usage example.
- Wrap feature sections with `<ErrorBoundary name="...">` from `@/components/shared/error-boundary`.

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

## Workflow

1. **Plan first**: Use `make-plan` before any non-trivial feature. Never code without an approved plan.
2. **Explore smart**: Use `smart-explore` for codebase research (AST-based, token-efficient). Avoid reading full files.
3. **Build UI**: Use `frontend-design` skill for components. Avoid generic AI aesthetics.
4. **Figma**: Use `figma-implement-design` for design-to-code. Always load `figma-use` skill first.
5. **Execute**: Use `do` to run plans with parallel subagents when possible.
6. **Review**: Run `simplify` after feature completion. Run `code-review` before PR.
7. **Verify**: `pnpm build && pnpm lint` must pass before commit.

## Quality Rules

- Prop types always explicit. No `any` unless unavoidable.
- Error boundaries for route segments. No silent failures.
- No `dangerouslySetInnerHTML`. Sanitize all user input.
- No hardcoded secrets. Use env variables.
- Accessible by default: semantic HTML, aria labels, keyboard nav.

## Claude Behavior

- Be concise. No verbose JSDoc on obvious code.
- YAGNI — don't create abstractions until needed.
- Always follow the approved plan. Do not deviate.
- Run `pnpm build` after changes to verify.
- Use memory: save feedback, project decisions, user preferences.
- Use parallel agents for independent tasks (research, test, lint).
- Keep this file under 120 lines.
- Conversation language: Turkish. Code/comments: English.
