#!/bin/bash
# Claude Code Memory Onboarding
# Run this after cloning the repo: bash scripts/claude-onboarding.sh

set -e

# Detect project path for Claude memory
PROJECT_PATH=$(cd "$(dirname "$0")/.." && pwd)
# Claude stores memories per-project using the absolute path with / replaced by -
# Underscores in path are also replaced with dashes, leading dash is kept
MEMORY_KEY=$(echo "$PROJECT_PATH" | sed 's|/|-|g; s|_|-|g')
MEMORY_DIR="$HOME/.claude/projects/$MEMORY_KEY/memory"

echo "Setting up Claude Code memory for: $PROJECT_PATH"
echo "Memory directory: $MEMORY_DIR"

mkdir -p "$MEMORY_DIR"

# --- MEMORY.md (append project entries if not already present) ---
touch "$MEMORY_DIR/MEMORY.md"
grep -q "project_conventions.md" "$MEMORY_DIR/MEMORY.md" || \
  echo "- [Project Conventions](project_conventions.md) — Workflow, quality rules, skill usage for this project" >> "$MEMORY_DIR/MEMORY.md"
grep -q "team_standards.md" "$MEMORY_DIR/MEMORY.md" || \
  echo "- [Team Standards](team_standards.md) — Code review checklist, PR process, deploy flow" >> "$MEMORY_DIR/MEMORY.md"

# --- Project Conventions ---
cat > "$MEMORY_DIR/project_conventions.md" << 'EOF'
---
name: Project Conventions
description: Workflow order, required skills, and quality gates for this Next.js template
type: project
---

This project uses a strict AI-assisted development workflow.

**Workflow order (matches `CLAUDE.md`):**
1. make-plan → get approval before any non-trivial feature
2. smart-explore → token-efficient codebase research (AST-based)
3. frontend-design → production-grade UI, avoid generic AI look
4. figma-implement-design → design-to-code (load `figma-use` first for any Figma write/read that needs plugin context)
5. do → execute plan with parallel subagents when possible
6. simplify + code-review → after feature completion; self-review before PR
7. verify → `pnpm build && pnpm lint` must pass before commit

**Why:** Token cost optimization and consistent quality across all contributors.

**How to apply:** Never skip the plan step. Do not deviate from the approved plan. Use parallel agents for independent tasks (research, test, lint). Use `mem-search` when asking whether something was solved in a prior session.

**Language:** User-facing assistant replies in Turkish; code and comments in English.

**Required reading before writing code:**
- `CLAUDE.md` — project rules (loaded automatically every conversation)
- `.claude/PATTERNS.md` — component, service, and form patterns
- `components/shared/REGISTRY.md` — shadcn + shared component catalog
- `.claude/design-system-rules.md` — color tokens, typography, spacing
- `.claude/form-rules.md` — when building or editing forms (react-hook-form + zod)
EOF

# --- Team Standards ---
cat > "$MEMORY_DIR/team_standards.md" << 'EOF'
---
name: Team Standards
description: PR process, code review checklist, and deploy flow for the team
type: project
---

**PR process:**
- Branch naming: `feat/xxx`, `fix/xxx`, `chore/xxx`, `refactor/xxx`, `docs/xxx`
- PR must pass: `pnpm build && pnpm lint`
- Self-review with code-review skill before requesting team review
- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:` (same as `CLAUDE.md`)

**Code review checklist:**
- Prop types explicit; no `any` unless unavoidable
- Error boundaries on route segments; no silent failures
- No hardcoded secrets; use environment variables
- No `dangerouslySetInnerHTML`; sanitize all user input
- Accessible: semantic HTML, aria labels, keyboard navigation
- Mobile-first responsive design; semantic Tailwind tokens (no raw hex colors)

**Deploy:** VPS / self-hosted (not Vercel/Netlify)
EOF

echo ""
echo "✓ Claude Code memory initialized with $(ls "$MEMORY_DIR"/*.md | wc -l | tr -d ' ') files:"
ls -1 "$MEMORY_DIR"
echo ""
echo "Done! Claude Code will now use these conventions in every conversation."
echo "To customize, edit files in: $MEMORY_DIR"
