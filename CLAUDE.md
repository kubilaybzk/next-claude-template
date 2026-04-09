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
    validations/        # Zod schemas + inferred types
    store/              # Redux slice (only if needed)
providers/              # App-level context providers
services/               # Shared API layer (base client, query keys)
hooks/                  # Shared hooks
lib/                    # General utilities
store/                  # Redux store config
types/                  # Shared TypeScript types
constants/              # App-wide constants
scripts/                # Dev scripts (onboarding, etc.)
.claude/
  PATTERNS.md           # Development patterns (components, queries, forms)
  REGISTRY.md           # shadcn + shared component catalog
  design-system-rules.md # Color tokens, typography, spacing
  form-rules.md         # react-hook-form + zod patterns (auto-loaded)
  skills/               # Project-local skills (/page, /scaffold)
```

## Naming

- Files: `kebab-case.ts` (e.g., `use-auth.ts`, `api-client.ts`)
- Components: `PascalCase` function name, `kebab-case` file
- Hooks: `use-` prefix (e.g., `use-redux.ts`)
- Imports: always use `@/` alias
- Exports: named exports. Default export only for page/layout files.

## Components

- Server components by default. Add `'use client'` only when needed.
- Use shadcn from `@/components/ui/` — never modify ui/ files directly. This is `base-vega` style: use `render` prop for polymorphic components (NOT `asChild`).
- **Before creating UI**: MUST read `.claude/REGISTRY.md` and `.claude/PATTERNS.md` — never use raw HTML when a shadcn or shared component exists.
- Used in 1 place → `features/[name]/components/`. Used in 2+ places → `components/shared/`.
- When adding to shared: update `.claude/REGISTRY.md` with name, path, props and small description.
- Wrap feature sections with `<ErrorBoundary name="...">` from `@/components/shared/error-boundary`.
- **Icons**: Phosphor only. Client: `@phosphor-icons/react`. Server: `@phosphor-icons/react/dist/ssr`.
- **Pages**: Every `page.tsx` must export `metadata` for SEO. See `PATTERNS.md` for static/dynamic examples.

## State Management

- **Server state**: React Query (always). Fetch, cache, sync with API.
- **Local UI state**: React useState/useReducer.
- **Cross-feature client state**: Redux Toolkit (rare). Never store server data in Redux.

## API Layer

- Base client: `services/api-client.ts` (native fetch wrapper)
- Query keys: `services/query-keys.ts` — factory pattern `[feature, resource, params?]`
- Feature services: `features/[name]/services/` — export React Query hooks
- **Hook pattern**: Inline API calls directly into hooks (no separate service functions). Each hook is self-contained with JSDoc documenting params, return type, and cache invalidation.
  - Fetch: `useQuery({ queryFn: () => apiClient.get(...) })`
  - Mutate: `useMutation({ mutationFn: (data) => apiClient.post(...), onSuccess: () => queryClient.invalidateQueries(...) })`
- Proxy: `proxy.ts` (Next.js 16 replacement for middleware) — auth, redirects, locale
- **No guessing**: Never create placeholder types, TODO endpoints, or mock API shapes. If endpoint/type info is missing, ASK the user to provide endpoints, Swagger/OpenAPI URL, or backend source code. Do not proceed without real API information. Exception: `/scaffold` and `/page` skills create minimal TODO placeholders as starting points — fill them in immediately with real data.

## Styling

- Tailwind utilities only. No custom CSS unless absolutely necessary.
- Use `cn()` from `@/lib/utils` for conditional classes.
- CSS variables defined in `app/globals.css`. Read `.claude/design-system-rules.md` for tokens.
- Use semantic color tokens, never raw colors.

## Git

- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
- Branch naming: `feat/…`, `fix/…`, `chore/…`, `refactor/…`, `docs/…`

## Workflow

1. **Plan first**: Use `make-plan` before any non-trivial feature. Never code without an approved plan. During planning, ask: (a) API endpoints & types — request Swagger URL, endpoint list, or backend source; (b) Design — ask if user has a Figma file or reference design. If no design provided, create UI using `frontend-design` skill.
2. **Explore smart**: Use `smart-explore` for codebase research (AST-based, token-efficient). Avoid reading full files.
3. **Scaffold**: Use `/scaffold <name>` for new features, `/page <route>` for new routes.
4. **Build UI**: Use `frontend-design` skill for components. Avoid generic AI aesthetics.
5. **Figma**: Use `figma-implement-design` for design-to-code. Always load `figma-use` skill first.
6. **Execute**: Use `do` to run plans with parallel subagents when possible.
7. **Review**: Run `simplify` after feature completion. Run `code-review` before PR.
8. **Verify**: `pnpm build && pnpm lint` must pass before commit.

## Quality Rules

- Prop types always explicit. No `any` unless unavoidable.
- Error boundaries for route segments. No silent failures.
- No `dangerouslySetInnerHTML`. Sanitize all user input.
- No hardcoded secrets. Use env variables.
- Accessible by default: semantic HTML, aria labels, keyboard nav.
- API layer: inline API calls into hooks (no separate private functions). Document with JSDoc: params, return type, cache invalidation strategy.

## Claude Behavior

- JSDoc policy: No verbose comments on obvious component code. **DO** add JSDoc to API layer (services), complex business logic, and React Query hooks to clarify cache behavior.
- YAGNI — don't create abstractions until needed.
- Always follow the approved plan. Do not deviate.
- Run `pnpm build` after changes to verify.
- Use memory: save feedback, project decisions, user preferences.
- Use `mem-search` when the answer may be in persistent project memory from earlier sessions.
- Use parallel agents for independent tasks (research, test, lint).
- Conversation language: Turkish. Code/comments: English.
