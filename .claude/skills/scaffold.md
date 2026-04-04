---
name: scaffold
description: Scaffold a new feature with boilerplate files and folder structure
command: scaffold
---

# Scaffold Feature Skill

When invoked with `/scaffold <feature-name>`, create a complete feature scaffold.

## Instructions

1. Take the feature name from the argument (e.g., `/scaffold auth` → feature name is `auth`)
2. Read `.claude/PATTERNS.md` for the correct file patterns
3. Read `components/shared/REGISTRY.md` to avoid duplicating existing components
4. Read `.claude/design-system-rules.md` for styling tokens and component composition rules
5. Create the following structure:

```
features/<name>/
  components/
  hooks/
  services/<name>-service.ts
  validations/
  types/index.ts
app/<name>/
  page.tsx
```

## File Templates

### `features/<name>/types/index.ts`
```tsx
export interface <Name> {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Create<Name>Input {
  // TODO: define create input fields
}

export type Update<Name>Input = Partial<Create<Name>Input>;
```

### `features/<name>/services/<name>-service.ts`
```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { queryKeys } from '@/services/query-keys';
import type { <Name>, Create<Name>Input, Update<Name>Input } from '@/features/<name>/types';
import type { PaginatedResponse, PaginationParams } from '@/types/api';

// --- Service functions ---

function get<Name>s(params?: PaginationParams) {
  return apiClient.get<PaginatedResponse<<Name>>>('/<name>s', { params: params as Record<string, string> });
}

function get<Name>ById(id: string) {
  return apiClient.get<<Name>>(`/<name>s/${id}`);
}

function create<Name>(data: Create<Name>Input) {
  return apiClient.post<<Name>>('/<name>s', data);
}

function update<Name>(id: string, data: Update<Name>Input) {
  return apiClient.put<<Name>>(`/<name>s/${id}`, data);
}

function delete<Name>(id: string) {
  return apiClient.delete(`/<name>s/${id}`);
}

// --- React Query hooks ---

export function use<Name>s(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.list('<name>s', params),
    queryFn: () => get<Name>s(params),
  });
}

export function use<Name>(id: string) {
  return useQuery({
    queryKey: queryKeys.detail('<name>s', id),
    queryFn: () => get<Name>ById(id),
    enabled: !!id,
  });
}

export function useCreate<Name>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create<Name>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all('<name>s') });
    },
  });
}

export function useUpdate<Name>(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Update<Name>Input) => update<Name>(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all('<name>s') });
    },
  });
}

export function useDelete<Name>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: delete<Name>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all('<name>s') });
    },
  });
}
```

### `app/<name>/page.tsx`
```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '<Title>',
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

## Rules

- Replace `<name>` with the kebab-case feature name (e.g., `user-profile`)
- Replace `<Name>` with the PascalCase feature name (e.g., `UserProfile`)
- All imports must use `@/` alias
- Service file must follow the pattern from `.claude/PATTERNS.md`
- Types must follow the pattern from `.claude/PATTERNS.md`
- Always export `metadata` in page.tsx — never create a page without it
- Use `render` prop (not `asChild`) for polymorphic components (base-vega style)
- Use semantic color tokens from design-system-rules.md — never hardcode colors
- After creating files, run `pnpm build` to verify no errors
- Report what was created to the user
