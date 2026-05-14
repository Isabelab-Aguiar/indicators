export const CRITERION_COLORS = [
  {
    bar: 'bg-emerald-500',
    barLight: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    border: 'hover:border-emerald-500/40',
  },
  {
    bar: 'bg-blue-500',
    barLight: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    border: 'hover:border-blue-500/40',
  },
  {
    bar: 'bg-violet-500',
    barLight: 'bg-violet-500/10',
    text: 'text-violet-600 dark:text-violet-400',
    badge: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
    border: 'hover:border-violet-500/40',
  },
  {
    bar: 'bg-amber-500',
    barLight: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    border: 'hover:border-amber-500/40',
  },
] as const

export type CriterionColor = (typeof CRITERION_COLORS)[number]

export const CLASSIFICATION_STYLES: Record<
  'otimo' | 'bom' | 'suficiente' | 'regular',
  { badge: string; label: string }
> = {
  otimo: { badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400', label: 'Ótimo' },
  bom: { badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-400', label: 'Bom' },
  suficiente: { badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-400', label: 'Suficiente' },
  regular: { badge: 'bg-red-500/10 text-red-700 dark:text-red-400', label: 'Regular' },
}
