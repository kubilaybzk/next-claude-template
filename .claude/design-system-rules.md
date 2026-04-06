# Design System Rules

> Claude: Read this file when building UI components to ensure visual consistency.

## Color System

Use CSS variables from `app/globals.css`. Never hardcode colors.

| Token | Usage | Tailwind Class |
|-------|-------|---------------|
| `primary` | Buttons, links, active states | `bg-primary text-primary-foreground` |
| `secondary` | Secondary buttons, subtle backgrounds | `bg-secondary text-secondary-foreground` |
| `muted` | Disabled, placeholder, subtle text | `bg-muted text-muted-foreground` |
| `accent` | Hover states, highlights | `bg-accent text-accent-foreground` |
| `destructive` | Errors, delete actions, warnings | `bg-destructive text-destructive-foreground` |
| `card` | Card backgrounds | `bg-card text-card-foreground` |
| `popover` | Popover/dropdown backgrounds | `bg-popover text-popover-foreground` |
| `border` | All borders | `border-border` |
| `input` | Input borders | `border-input` |
| `ring` | Focus rings | `ring-ring` |

**Rules:**
- Never use raw colors like `bg-blue-500` or `text-gray-600`
- Always use semantic tokens: `text-muted-foreground` not `text-gray-500`
- Dark mode is automatic via CSS variables — no `dark:` prefix needed for tokens

## Typography

| Use For | Class |
|---------|-------|
| Page title | `text-2xl font-bold` or `text-3xl font-bold` |
| Section title | `text-xl font-semibold` |
| Card title | `text-lg font-semibold` (or use `CardTitle`) |
| Body text | `text-sm` (default) |
| Helper/caption | `text-xs text-muted-foreground` |
| Mono/code | `font-mono text-xs` |

**Font:** Source Sans 3 (`--font-sans`), Geist Mono (`--font-mono`)

## Spacing

Follow Tailwind's 4px grid. Common patterns:
- Page padding: `px-4 py-8` (mobile) → `container mx-auto` (desktop)
- Card gap: `gap-6` (default) or `gap-4` (compact)
- Form fields: `space-y-4`
- Button groups: `gap-2`
- Inline items: `gap-2` or `gap-3`

## Border Radius

Base radius: `0.625rem`. Use Tailwind's `rounded-*` classes:
- Buttons, inputs: `rounded-md` (automatic via shadcn)
- Cards: `rounded-xl` (automatic via shadcn)
- Full round: `rounded-full` (avatars, badges)

## Shadows

- Cards: `shadow-xs` (automatic via shadcn)
- Elevated: `shadow-sm`
- No heavy shadows — keep the design flat

## Responsive Breakpoints

Mobile-first approach:
```
Default    → mobile (< 640px)
sm:        → ≥ 640px
md:        → ≥ 768px
lg:        → ≥ 1024px
xl:        → ≥ 1280px
```

Common pattern:
```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
```

## Component Composition Rules

1. **Cards** — Always use `Card` + `CardHeader` + `CardContent`. Never raw divs with card-like styles.
2. **Forms** — Use `Field` + `Label` + `Input`/`Select`/etc. Never raw form elements.
3. **Buttons** — Primary for main actions, `outline` for secondary, `ghost` for tertiary, `destructive` for delete.
4. **Empty states** — Use `Empty` component when no data. Never blank space.
5. **Loading** — `Skeleton` for initial data loading (page/section placeholders). `Spinner` for in-progress actions (button submit, inline fetch). Spinner is client-only.
6. **Feedback** — Use `toast()` from sonner for mutations. Never `alert()`.
7. **Icons** — Phosphor only (see `CLAUDE.md` for import paths). Size `size-4` inline, `size-5` standalone.

## Anti-Patterns (Visual)

- ❌ `bg-blue-500` → ✅ `bg-primary`
- ❌ `text-gray-500` → ✅ `text-muted-foreground`
- ❌ `border-gray-200` → ✅ `border-border`
- ❌ `dark:bg-gray-800` → ✅ `bg-card` (auto dark mode)
- ❌ `window.alert()` → ✅ `toast()`

For component anti-patterns (raw HTML, wrong icon library) see `CLAUDE.md → Components`.
