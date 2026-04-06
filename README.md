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
```

## Claude Code Skills

This project uses **Claude Code skills** — specialized CLI commands that work with AI to accelerate development. No installation needed; they're built into Claude Code.

### Available Skills

| Skill | Purpose | Usage | Example |
|-------|---------|-------|---------|
| **make-plan** | Design feature architecture before coding | `/make-plan [description]` | `/make-plan Add user authentication with JWT` |
| **smart-explore** | Search codebase efficiently (token-optimized AST-based) | `/smart-explore [query]` | `/smart-explore Find all React Query hooks` |
| **frontend-design** | Write production-grade UI components | Use in response to feature requests | "Build a login form" → UI + validation |
| **figma-implement-design** | Convert Figma designs to code (1:1 fidelity) | Load `figma-use` skill first, then use | `/figma-use` then `/figma-implement-design` |
| **do** | Execute plans with parallel subagents | `/do [plan description]` | `/do Execute the authentication feature plan` |
| **simplify** | Review & optimize code after features | `/simplify` | Run after feature is complete |
| **code-review** | Formal PR code review | `/code-review` | Before creating GitHub PR |

### Workflow Example

```
1. Start feature:         /make-plan Add dark mode toggle
2. Get approval from user
3. Research codebase:     /smart-explore Find theme context setup
4. Build components:      /frontend-design Create theme toggle UI
5. Execute plan:          /do Execute dark mode plan
6. Self-review:           /simplify (optimize the code)
                          /code-review (check quality)
7. Verify:                pnpm build && pnpm lint
8. Commit:                git commit -m "feat: add dark mode toggle"
```

### Skill Details

#### 1. **make-plan** — Architecture & Approval
Designs a detailed implementation plan before coding. Prevents wasted work.
```bash
/make-plan Add form validation with react-hook-form and Zod
```
✅ Returns a step-by-step plan  
✅ User approves/modifies  
✅ Blocks coding until approved  

#### 2. **smart-explore** — Token-Efficient Search
Searches codebase using AST parsing (much cheaper than reading files).
```bash
/smart-explore Where are the Redux store slices?
/smart-explore Show me all useMutation hooks
/smart-explore Find error handling patterns
```
✅ Returns file locations + code snippets  
✅ Uses tree-sitter (understands syntax, not just text)  
✅ Avoids reading entire files  

#### 3. **frontend-design** — Production UI
Generates polished, accessible components. Avoids generic AI aesthetics.
```bash
"Build a reusable Button component with loading state"
→ frontend-design invoked automatically
```
✅ Semantic HTML + ARIA labels  
✅ Matches design system tokens  
✅ Tailwind utilities only  

#### 4. **figma-implement-design** — Design-to-Code
Converts Figma files to production code with pixel-perfect fidelity.
```bash
# Must load figma-use skill first
/figma-use
# Then:
/figma-implement-design
# (Figma design automatically translated to React)
```
✅ Reads Figma components  
✅ Generates TSX + Tailwind  
✅ Maintains design system consistency  

#### 5. **do** — Plan Execution
Runs plans with parallel subagents (faster than sequential work).
```bash
/do Execute the dark mode feature plan from make-plan
```
✅ Parallelizes independent tasks  
✅ Tracks progress  
✅ Handles errors intelligently  

#### 6. **simplify** — Code Optimization
Reviews changed code for quality, reuse, and clarity.
```bash
/simplify
```
✅ Removes redundant code  
✅ Suggests better patterns  
✅ Auto-fixes common issues  

#### 7. **code-review** — PR Quality Gate
Formal review of pull request changes.
```bash
/code-review
```
✅ Checks against CLAUDE.md rules  
✅ Verifies TypeScript safety  
✅ Tests accessibility  

### When to Use Each Skill

| Situation | Skill |
|-----------|-------|
| "Build me a feature" | `make-plan` first |
| "Find where X is in the code" | `smart-explore` |
| "Create a component" | `frontend-design` |
| "Turn this Figma design into code" | `figma-use` + `figma-implement-design` |
| "I have the plan, let's build it" | `do` |
| "Is my code good?" | `simplify` + `code-review` |
| "Before I commit" | `code-review` + `pnpm build` |

### Rules

- ⚠️ **Always plan first** — non-trivial features need `/make-plan` + approval
- ⚠️ **Figma rule** — load `/figma-use` BEFORE any `figma-implement-design`
- ⚠️ **Verify before commit** — `pnpm build && pnpm lint` must pass
- ✅ Skills are free — no setup, no API keys, built into Claude Code

## Contributing

- Follow conventions in `CLAUDE.md`
- Run `bash scripts/claude-onboarding.sh` after cloning
- Use conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
- PR must pass `pnpm build && pnpm lint`
