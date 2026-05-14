export interface CriterionColor {
  bar: string
  text: string
  badge: string
  ring: string
  hex: string
  hexMuted: string
}

const TONE_EMERALD: CriterionColor = {
  bar: 'bg-emerald-500',
  text: 'text-emerald-600 dark:text-emerald-400',
  badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  ring: 'ring-emerald-500/30',
  hex: '#10b981',
  hexMuted: '#10b98115',
}

const TONE_BLUE: CriterionColor = {
  bar: 'bg-blue-500',
  text: 'text-blue-600 dark:text-blue-400',
  badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  ring: 'ring-blue-500/30',
  hex: '#3b82f6',
  hexMuted: '#3b82f615',
}

const TONE_AMBER: CriterionColor = {
  bar: 'bg-amber-500',
  text: 'text-amber-600 dark:text-amber-400',
  badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  ring: 'ring-amber-500/30',
  hex: '#f59e0b',
  hexMuted: '#f59e0b15',
}

const TONE_RED: CriterionColor = {
  bar: 'bg-red-500',
  text: 'text-red-600 dark:text-red-400',
  badge: 'bg-red-500/10 text-red-700 dark:text-red-300',
  ring: 'ring-red-500/30',
  hex: '#ef4444',
  hexMuted: '#ef444415',
}

export const CRITERION_COLORS = [TONE_EMERALD, TONE_BLUE, TONE_AMBER, TONE_RED] as const

export function colorForRate(pct: number): CriterionColor {
  if (pct >= 80) return TONE_EMERALD
  if (pct >= 60) return TONE_BLUE
  if (pct >= 40) return TONE_AMBER
  return TONE_RED
}

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

export const NEUTRAL_TEXT = 'text-muted-foreground'
