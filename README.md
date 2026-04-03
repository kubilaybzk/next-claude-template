# Full Next.js Template

Production-ready Next.js 16 template with AI-assisted development workflow.

## Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS v4, shadcn/ui (base-vega, Phosphor icons)
- **State**: Redux Toolkit (client), React Query (server)
- **Package Manager**: pnpm

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment
cp .env.example .env.local

# 3. Setup Claude Code memory (one-time)
bash scripts/claude-onboarding.sh

# 4. Start development
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Claude Code Onboarding

This project uses [Claude Code](https://claude.ai/claude-code) for AI-assisted development. After cloning, run the onboarding script to initialize Claude's project memory:

```bash
bash scripts/claude-onboarding.sh
```

This sets up:
- **Project conventions** — workflow order, required skills, quality gates
- **Team standards** — PR process, code review checklist, deploy flow

The script writes to `~/.claude/` (local, not committed). Each developer runs it once. Project rules in `CLAUDE.md` are shared via git.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint check |
| `bash scripts/claude-onboarding.sh` | Setup Claude Code memory |

## Folder Structure

```
app/                    # Next.js routes & layouts
components/
  ui/                   # shadcn/ui components (do not edit)
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

## AI-Assisted Workflow

```
Plan (make-plan) → Explore (smart-explore) → Build UI (frontend-design)
→ Figma (figma-implement-design) → Execute (do) → Review (simplify + code-review)
→ Verify (build + lint) → Commit
```

## Contributing

- Follow conventions in `CLAUDE.md`
- Run `bash scripts/claude-onboarding.sh` after cloning
- Use conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
- PR must pass `pnpm build && pnpm lint`
