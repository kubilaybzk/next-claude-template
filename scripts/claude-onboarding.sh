#!/bin/bash
# Claude Code Memory Onboarding
# Run this after cloning the repo: bash scripts/claude-onboarding.sh

set -e

# Detect project path for Claude memory
PROJECT_PATH=$(cd "$(dirname "$0")/.." && pwd)
# Claude stores memories per-project using the absolute path with dashes
MEMORY_KEY=$(echo "$PROJECT_PATH" | sed 's|/|-|g; s|^-||')
MEMORY_DIR="$HOME/.claude/projects/$MEMORY_KEY/memory"

echo "Setting up Claude Code memory for: $PROJECT_PATH"
echo "Memory directory: $MEMORY_DIR"

mkdir -p "$MEMORY_DIR"

# --- MEMORY.md (index file) ---
cat > "$MEMORY_DIR/MEMORY.md" << 'EOF'
- [Project Conventions](project_conventions.md) — Workflow, quality rules, skill usage for this project
- [Team Standards](team_standards.md) — Code review checklist, PR process, deploy flow
EOF

# --- Project Conventions ---
cat > "$MEMORY_DIR/project_conventions.md" << 'EOF'
---
name: Project Conventions
description: Workflow order, required skills, and quality gates for this Next.js template
type: project
---

This project uses a strict AI-assisted development workflow.

**Workflow order:**
1. make-plan → get approval before any non-trivial feature
2. smart-explore → token-efficient codebase research (AST-based)
3. frontend-design → production-grade UI, avoid generic AI look
4. figma-implement-design → design-to-code (load figma-use first)
5. do → execute plan with parallel subagents
6. simplify → clean up after feature completion
7. code-review → self-review before PR

**Why:** Token cost optimization and consistent quality across all contributors.

**How to apply:** Never skip the plan step. Always run simplify + code-review before committing. Use parallel agents for independent tasks.
EOF

# --- Team Standards ---
cat > "$MEMORY_DIR/team_standards.md" << 'EOF'
---
name: Team Standards
description: PR process, code review checklist, and deploy flow for the team
type: project
---

**PR process:**
- Branch naming: feat/xxx, fix/xxx, chore/xxx
- PR must pass: pnpm build && pnpm lint
- Self-review with code-review skill before requesting team review
- Conventional commits required

**Code review checklist:**
- No `any` types unless unavoidable
- Error boundaries on route segments
- No hardcoded secrets or API URLs
- Accessible: semantic HTML, aria labels, keyboard nav
- Mobile-first responsive design

**Deploy:** VPS / self-hosted (not Vercel/Netlify)
EOF

echo ""
echo "✓ Claude Code memory initialized with $(ls "$MEMORY_DIR"/*.md | wc -l | tr -d ' ') files:"
ls -1 "$MEMORY_DIR"
echo ""
echo "Done! Claude Code will now use these conventions in every conversation."
echo "To customize, edit files in: $MEMORY_DIR"
