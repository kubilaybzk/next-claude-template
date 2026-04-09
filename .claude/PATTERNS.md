# Development Patterns

> Claude: Read this file before writing components, services, or forms.

## Component Pattern

```tsx
// features/users/components/user-card.tsx
'use client'; // only if hooks, events, or browser APIs are used

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { User } from '@/features/users/types';

interface UserCardProps {
  user: User;
  onDelete?: (id: string) => void;
}

export function UserCard({ user, onDelete }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={() => onDelete(user.id)}>
            Delete
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

**Rules:** See `CLAUDE.md → Components` for full rules. Key patterns:
- Props interface above component, always explicit types
- Destructure props in function signature

**Polymorphic component (Button as Link):**
```tsx
// ✅ Internal link — render prop (base-vega)
<Button render={<Link href="/users" />}>Go to Users</Button>

// ✅ External link — add nativeButton={false} to prevent button behavior
<Button nativeButton={false} render={<Link href="https://example.com" target="_blank" />}>External</Button>

// ❌ Wrong — asChild does not exist
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

**Preferred pattern: inline API calls into hooks for cleaner, self-contained code**

```tsx
// features/users/services/user-service.ts (mutations)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateUserInput, UpdateUserInput } from '@/features/users/validations/create-user-schema';

/**
 * Mutation hook for creating user
 * @returns Mutation object; invalidates user list cache on success
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserInput) =>
      apiClient.post<User>('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all('users') });
    },
  });
}

/**
 * Mutation hook for updating user
 * @param id - User ID to update
 * @returns Mutation object; invalidates user list cache on success
 */
export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserInput) =>
      apiClient.put<User>(`/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all('users') });
    },
  });
}

/**
 * Mutation hook for deleting user
 * @returns Mutation object; invalidates user list cache on success
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all('users') });
    },
  });
}
```

**Rules:** See `CLAUDE.md → State Management / API Layer` for architecture rules. Key patterns:
- **API calls inline into hooks** (no separate service functions). Each hook is self-contained.
- Always document with JSDoc: params, return type, cache invalidation strategy
- Always invalidate related queries on mutation success
- Use `enabled` for conditional fetching in queries
- Fetch pattern: `useQuery({ queryFn: () => apiClient.get(...) })`
- Mutation pattern: `useMutation({ mutationFn: (data) => apiClient.post(...), onSuccess: () => invalidate })`

## Using Services in Components

```tsx
// features/users/components/user-list.tsx
'use client';

import { useUsers, useDeleteUser } from '@/features/users/services/user-service';
import { ErrorMessage } from '@/components/shared/error-message';
import { EmptyState } from '@/components/shared/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from '@phosphor-icons/react';
import { toast } from 'sonner';

export function UserList() {
  const { data, isLoading, error, refetch } = useUsers();
  const deleteUser = useDeleteUser();

  if (isLoading) return <UserListSkeleton />;
  if (error) return <ErrorMessage message={error.message} retry={refetch} />;
  if (!data?.data.length) {
    return (
      <EmptyState
        icon={<Users className="size-6" />}
        title="No users"
        description="Create your first user to get started."
      />
    );
  }

  const handleDelete = (id: string) => {
    deleteUser.mutate(id, {
      onSuccess: () => toast.success('User deleted'),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="space-y-3">
      {data.data.map((user) => (
        <UserCard key={user.id} user={user} onDelete={handleDelete} />
      ))}
    </div>
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
- Loading → `Skeleton`, Error → `ErrorMessage` (shared), Empty → `EmptyState` (shared), Mutation feedback → `toast()`
- See `design-system-rules.md → Component Composition Rules` for Loading vs Spinner distinction
- Wrap from parent: `<ErrorBoundary name="UserList"><UserList /></ErrorBoundary>` — never inside the component itself

## Feature Types

Domain models go in `types/`. Form input types are inferred from zod schemas in `validations/` (see `form-rules.md`).

```tsx
// features/users/types/index.ts — domain models only
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

// Form input types (CreateUserInput, UpdateUserInput) live in
// features/users/validations/ as z.infer<typeof schema> — see form-rules.md
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

All form patterns are in `.claude/form-rules.md` (auto-loaded when working on form files).

## New Feature Checklist

When creating a new feature `[name]`:
1. Create `features/[name]/types/index.ts` — define data types
2. Create `features/[name]/validations/` — zod schemas + inferred types
3. Create `features/[name]/services/[name]-service.ts` — API hooks
4. Create `features/[name]/components/` — UI components
5. Add route in `app/[name]/` — `page.tsx` + `loading.tsx` + `error.tsx` + `not-found.tsx`
6. If shared state needed → `features/[name]/store/[name]-slice.ts` (rare)
7. If reusable component emerges → move to `components/shared/` + update `.claude/REGISTRY.md`
