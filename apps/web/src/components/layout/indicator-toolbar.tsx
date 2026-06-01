'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui'
import { QUADRIMESTRE_OPTIONS, buildYearOptions, type Quadrimestre } from '@/lib/quadrimestre'
import { useIndicatorFilters } from '@/providers/indicator-filters-provider'

const YEARS = buildYearOptions(new Date().getFullYear())

interface IndicatorToolbarProps {
  exportSlot?: React.ReactNode
}

export function IndicatorToolbar({ exportSlot }: IndicatorToolbarProps) {
  const { filters, microareaOptions, setFilters } = useIndicatorFilters()

  function set(partial: Partial<typeof filters>) {
    setFilters({ ...filters, ...partial })
  }

  return (
    <div className="border-border bg-background flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={String(filters.year)} onValueChange={(v) => set({ year: Number(v) })}>
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
          value={String(filters.quad)}
          onValueChange={(v) => set({ quad: Number(v) as Quadrimestre })}
        >
          <SelectTrigger className="h-8 w-[148px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {QUADRIMESTRE_OPTIONS.map((q) => (
              <SelectItem key={q.value} value={String(q.value)} className="text-xs">
                {q.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.microarea === '' ? '__all__' : filters.microarea}
          onValueChange={(v) => set({ microarea: v === '__all__' ? '' : v })}
        >
          <SelectTrigger className="h-8 w-[160px] text-xs">
            <SelectValue placeholder="Microárea" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__" className="text-xs">
              Todas as microáreas
            </SelectItem>
            {microareaOptions.map((m) => (
              <SelectItem key={m} value={m} className="text-xs">
                Microárea {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {exportSlot && <div>{exportSlot}</div>}
    </div>
  )
}
