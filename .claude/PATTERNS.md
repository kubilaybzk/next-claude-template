# Development Patterns

> Claude: Read this file before writing components, services, or forms.

## Component Pattern

```tsx
// features/users/components/user-card.tsx
'use client'; // only if hooks, events, or browser APIs are used

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/shared/error-boundary';
import type { User } from '@/features/users/types';

interface UserCardProps {
  user: User;
  onEdit?: (id: string) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(user.id)}>
            Edit
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

**Rules:**
- Props interface above component, always explicit types
- Destructure props in function signature
- Use shadcn components — never raw HTML for buttons, inputs, cards, etc.
- Wrap with `<ErrorBoundary>` at feature section level, not every component
- This project uses `base-vega` style: use `render` prop (not `asChild`) for polymorphic components

**Polymorphic component (Button as Link):**
```tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// ✅ Correct — base-vega style
<Button render={<Link href="/users" />}>Go to Users</Button>

// ❌ Wrong — asChild does not exist in base-vega
<Button asChild><Link href="/users">Go to Users</Link></Button>
```

## React Query — Fetch (GET)

```tsx
// features/users/services/user-service.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { queryKeys } from '@/services/query-keys';
import type { User } from '@/features/users/types';
import type { PaginatedResponse, PaginationParams } from '@/types/api';

// 1. Service function (pure fetch, no hooks)
function getUsers(params?: PaginationParams) {
  return apiClient.get<PaginatedResponse<User>>('/users', { params: params as Record<string, string> });
}

function getUserById(id: string) {
  return apiClient.get<User>(`/users/${id}`);
}

// 2. React Query hook (wraps service function)
export function useUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.list('users', params),
    queryFn: () => getUsers(params),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.detail('users', id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
}
```

## React Query — Mutation (POST/PUT/DELETE)

```tsx
// features/users/services/user-service.ts (same file, add mutations)
import { useMutation, useQueryClient } from '@tanstack/react-query';

function createUser(data: CreateUserInput) {
  return apiClient.post<User>('/users', data);
}

function updateUser(id: string, data: UpdateUserInput) {
  return apiClient.put<User>(`/users/${id}`, data);
}

function deleteUser(id: string) {
  return apiClient.delete(`/users/${id}`);
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all('users') });
    },
  });
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserInput) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all('users') });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all('users') });
    },
  });
}
```

**Rules:**
- Service function = pure fetch, no React hooks
- Hook = wraps service with `useQuery`/`useMutation`
- Always invalidate related queries on mutation success
- Use `enabled` for conditional fetching
- Never store API data in Redux — React Query is the server state cache

## Using Services in Components

```tsx
// features/users/components/user-list.tsx
'use client';

import { useUsers, useDeleteUser } from '@/features/users/services/user-service';
import { ErrorBoundary } from '@/components/shared/error-boundary';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export function UserList() {
  const { data, isLoading, error } = useUsers();
  const deleteUser = useDeleteUser();

  if (isLoading) return <UserListSkeleton />;
  if (error) return <p className="text-destructive">{error.message}</p>;

  const handleDelete = (id: string) => {
    deleteUser.mutate(id, {
      onSuccess: () => toast.success('User deleted'),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <ErrorBoundary name="UserList">
      {data?.data.map((user) => (
        <UserCard key={user.id} user={user} onDelete={handleDelete} />
      ))}
    </ErrorBoundary>
  );
}

function UserListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}
```

**Rules:**
- Show loading state with `Skeleton` component
- Show error state — never silently fail
- Use `toast()` from sonner for mutation feedback
- Skeleton component = same file if small, separate file if reused

## Feature Types

```tsx
// features/users/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export type UpdateUserInput = Partial<CreateUserInput>;
```

## Page Metadata (SEO)

Every `page.tsx` must export `metadata`. Never create a page without it.

```tsx
// Static metadata
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View your dashboard and analytics',
};
```

```tsx
// Dynamic metadata (for detail pages)
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `User ${id}`,
    description: `User profile for ${id}`,
  };
}
```

## Forms

Forms use react-hook-form + zod. Detailed patterns in `.claude/form-rules.md` (auto-loaded when working on form files).

Key rules:
- Schema in `features/[name]/validations/[schema-name]-schema.ts`
- Every field needs a default value
- Validation errors inline, never via toast
- Add `<FormValidationDebugger methods={methods} />` to every form

## New Feature Checklist

When creating a new feature `[name]`:
1. Create `features/[name]/types/index.ts` — define data types
2. Create `features/[name]/validations/` — zod schemas + inferred types
3. Create `features/[name]/services/[name]-service.ts` — API hooks
4. Create `features/[name]/components/` — UI components
5. Add route in `app/[name]/page.tsx`
6. If shared state needed → `features/[name]/store/[name]-slice.ts` (rare)
7. If reusable component emerges → move to `components/shared/` + update `REGISTRY.md`
