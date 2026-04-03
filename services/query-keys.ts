export const queryKeys = {
  all: (feature: string) => [feature] as const,
  list: (feature: string, params?: Record<string, unknown>) =>
    [feature, 'list', params] as const,
  detail: (feature: string, id: string | number) =>
    [feature, 'detail', id] as const,
};
