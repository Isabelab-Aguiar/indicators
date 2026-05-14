export const CRITERION_COLORS = [
  {
    bar: 'bg-emerald-500',
    barLight: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    border: 'hover:border-emerald-500/40',
    hex: '#10b981',
    hexMuted: '#10b98120',
  },
  {
    bar: 'bg-blue-500',
    barLight: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    border: 'hover:border-blue-500/40',
    hex: '#3b82f6',
    hexMuted: '#3b82f620',
  },
  {
    bar: 'bg-violet-500',
    barLight: 'bg-violet-500/10',
    text: 'text-violet-600 dark:text-violet-400',
    badge: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
    border: 'hover:border-violet-500/40',
    hex: '#8b5cf6',
    hexMuted: '#8b5cf620',
  },
  {
    bar: 'bg-amber-500',
    barLight: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    border: 'hover:border-amber-500/40',
    hex: '#f59e0b',
    hexMuted: '#f59e0b20',
  },
] as const

export type CriterionColor = (typeof CRITERION_COLORS)[number]

export const CLASSIFICATION_STYLES: Record<
  'otimo' | 'bom' | 'suficiente' | 'regular',
  { badge: string; label: string; hex: string }
> = {
  otimo: {
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    label: 'Ótimo',
    hex: '#10b981',
  },
  bom: {
    badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    label: 'Bom',
    hex: '#3b82f6',
  },
  suficiente: {
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    label: 'Suficiente',
    hex: '#f59e0b',
  },
  regular: {
    badge: 'bg-red-500/10 text-red-700 dark:text-red-400',
    label: 'Regular',
    hex: '#ef4444',
  },
}

export const DANGER_COLORS = {
  bg: 'bg-red-500/10',
  text: 'text-red-600 dark:text-red-400',
  border: 'hover:border-red-500/30',
  hex: '#ef4444',
  hexMuted: '#ef444420',
} as const
