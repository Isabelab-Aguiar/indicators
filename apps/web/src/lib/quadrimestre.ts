export type Quadrimestre = 1 | 2 | 3

export function getQuadrimestre(d: Date): Quadrimestre {
  const m = d.getMonth() + 1
  return m <= 4 ? 1 : m <= 8 ? 2 : 3
}

export const QUADRIMESTRE_LABELS: Record<Quadrimestre, string> = {
  1: 'Jan a Abr',
  2: 'Mai a Ago',
  3: 'Set a Dez',
}

export const QUADRIMESTRE_OPTIONS: ReadonlyArray<{ value: Quadrimestre; label: string }> = [
  { value: 1, label: '1º · Jan a Abr' },
  { value: 2, label: '2º · Mai a Ago' },
  { value: 3, label: '3º · Set a Dez' },
]

export function buildYearOptions(current: number, back = 2, forward = 1): number[] {
  const start = current - back
  const end = current + forward
  const years: number[] = []
  for (let y = end; y >= start; y--) years.push(y)
  return years
}

export function isoInQuadrimestre(iso: string, year: number, quad: Quadrimestre): boolean {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return false
  return d.getUTCFullYear() === year && getQuadrimestre(d) === quad
}
