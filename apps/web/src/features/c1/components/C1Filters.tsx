'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 4 }, (_, i) => CURRENT_YEAR - i)

const QUADRIMESTRES = [
  { value: 'todos', label: 'Todos' },
  { value: '1', label: 'Q1 — Jan a Abr' },
  { value: '2', label: 'Q2 — Mai a Ago' },
  { value: '3', label: 'Q3 — Set a Dez' },
] as const

interface C1FiltersProps {
  year: number
  quadrimestre: number | null
  onYearChange: (year: number) => void
  onQuadrimestreChange: (q: number | null) => void
}

export function C1Filters({
  year,
  quadrimestre,
  onYearChange,
  onQuadrimestreChange,
}: C1FiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Select value={String(year)} onValueChange={(v) => onYearChange(Number(v))}>
        <SelectTrigger className="h-8 w-[100px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map((y) => (
            <SelectItem key={y} value={String(y)} className="text-xs">
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={quadrimestre === null ? 'todos' : String(quadrimestre)}
        onValueChange={(v) => onQuadrimestreChange(v === 'todos' ? null : Number(v))}
      >
        <SelectTrigger className="h-8 w-[148px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {QUADRIMESTRES.map((q) => (
            <SelectItem key={q.value} value={q.value} className="text-xs">
              {q.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
