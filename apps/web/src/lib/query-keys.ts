import type { PregnantWomanFilters } from '@repo/types'

export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  dashboard: {
    metrics: (esfId: string) => ['dashboard', 'metrics', esfId] as const,
    microareaStats: (esfId: string) => ['dashboard', 'microarea-stats', esfId] as const,
  },
  pregnantWomen: {
    all: (esfId: string) => ['pregnant-women', esfId] as const,
    list: (esfId: string, filters: PregnantWomanFilters) =>
      ['pregnant-women', esfId, 'list', filters] as const,
    detail: (id: string) => ['pregnant-women', id, 'detail'] as const,
  },
  c3: {
    all: (esfId: string) => ['c3', esfId] as const,
    breakdown: (esfId: string) => ['c3', esfId, 'breakdown'] as const,
  },
  c5: {
    all: (esfId: string) => ['c5', esfId] as const,
    breakdown: (esfId: string) => ['c5', esfId, 'breakdown'] as const,
  },
  c6: {
    all: (esfId: string) => ['c6', esfId] as const,
    breakdown: (esfId: string) => ['c6', esfId, 'breakdown'] as const,
  },
  c7: {
    all: (esfId: string) => ['c7', esfId] as const,
    breakdown: (esfId: string) => ['c7', esfId, 'breakdown'] as const,
  },
  c1: {
    all: (esfId: string) => ['c1', esfId] as const,
    execucoes: (esfId: string, filters?: object) => ['c1', esfId, 'execucoes', filters] as const,
    execucao: (id: string) => ['c1', 'execucao', id] as const,
    analytics: (esfId: string) => ['c1', esfId, 'analytics'] as const,
    importacao: (id: string) => ['c1', 'importacao', id] as const,
  },
  imports: {
    all: (esfId: string) => ['imports', esfId] as const,
    detail: (id: string) => ['imports', id, 'detail'] as const,
  },
  users: {
    all: (esfId: string) => ['users', esfId] as const,
    detail: (id: string) => ['users', id, 'detail'] as const,
  },
  esf: {
    all: () => ['esf'] as const,
    detail: (id: string) => ['esf', id] as const,
  },
  audit: {
    all: (esfId: string) => ['audit', esfId] as const,
  },
} as const
