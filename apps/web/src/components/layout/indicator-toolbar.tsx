'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui'
import { QUADRIMESTRE_OPTIONS, buildYearOptions, type Quadrimestre } from '@/lib/quadrimestre'
import { useIndicatorFilters } from '@/providers/indicator-filters-provider'

const YEARS = buildYearOptions(new Date().getFullYear())

interface IndicatorToolbarProps {
  exportSlot?: React.ReactNode
  hideOnTabs?: string[] // tabs onde os filtros ficam ocultos (ex: ['importar', 'simulador'])
  activeTab?: string
}

export function IndicatorFilters({ exportSlot, hideOnTabs, activeTab }: IndicatorToolbarProps) {
  const { filters, microareaOptions, setFilters } = useIndicatorFilters()

  if (hideOnTabs && activeTab && hideOnTabs.includes(activeTab)) return null

  function set(partial: Partial<typeof filters>) {
    setFilters({ ...filters, ...partial })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={String(filters.year)} onValueChange={(v) => set({ year: Number(v) })}>
        <SelectTrigger className="h-8 w-[90px] text-xs">
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

      {microareaOptions.length > 0 && (
        <Select
          value={filters.microarea === '' ? '__all__' : filters.microarea}
          onValueChange={(v) => set({ microarea: v === '__all__' ? '' : v })}
        >
          <SelectTrigger className="h-8 w-[148px] text-xs">
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
      )}

      {exportSlot}
    </div>
  )
}

// mantém o export antigo para não quebrar imports existentes
export { IndicatorFilters as IndicatorToolbar }
