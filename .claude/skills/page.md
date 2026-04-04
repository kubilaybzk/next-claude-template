---
name: page
description: Scaffold a new route page with loading, error, and not-found states
command: page
---

# Page Scaffold Skill

When invoked with `/page <route-name>`, create a complete page with all Next.js conventions.

## Instructions

1. Take the route name from the argument (e.g., `/page dashboard` → route is `dashboard`, `/page settings/profile` → nested route)
2. Read `components/shared/REGISTRY.md` for available components
3. Read `.claude/design-system-rules.md` for styling tokens
4. Create the following files:

```
app/<route>/
  page.tsx         (with metadata export)
  loading.tsx      (Skeleton-based loading)
  error.tsx        (ErrorBoundary with reset)
  not-found.tsx    (404 fallback)
```

## File Templates

### `app/<route>/page.tsx`
```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '<Title> | App Name',
  description: '<Description of this page>',
};

export default function <Name>Page() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold"><Title></h1>
      {/* TODO: implement page content */}
    </div>
  );
}
```

### `app/<route>/loading.tsx`
```tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto py-8 space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
```

### `app/<route>/error.tsx`
```tsx
'use client';

import { Button } from '@/components/ui/button';
import { ArrowClockwise } from '@phosphor-icons/react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>
        <ArrowClockwise />
        Try again
      </Button>
    </div>
  );
}
```

### `app/<route>/not-found.tsx`
```tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-muted-foreground">Page not found</p>
      <Button render={<Link href="/" />}>
        <ArrowLeft />
        Go back
      </Button>
    </div>
  );
}
```

## Rules

- Replace `<route>` with the kebab-case route path
- Replace `<Name>` with PascalCase (e.g., `dashboard` → `Dashboard`, `user-profile` → `UserProfile`)
- Replace `<Title>` with a human-readable title
- Always export `metadata` for SEO — never create a page without it
- Use shadcn components (Button, Skeleton) — never raw HTML
- Use Phosphor icons — never Lucide or Heroicons
- Use `render` prop for polymorphic components (not `asChild`)
- After creating files, run `pnpm build` to verify no errors
- Report what was created to the user
