'use client'

import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'

import { Badge, Button, cn, Input } from '@repo/ui'
import type { PregnantWomanFilters } from '@repo/types'

interface PregnantWomenFiltersProps {
  filters: PregnantWomanFilters
  onChange: (filters: PregnantWomanFilters) => void
}

type BpStatus = 'normal' | 'elevated' | 'high' | 'critical'

const BP_OPTIONS: Array<{ value: BpStatus; label: string }> = [
  { value: 'normal', label: 'Normal' },
  { value: 'elevated', label: 'Elevada' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
]

export function PregnantWomenFilters({ filters, onChange }: PregnantWomenFiltersProps) {
  const [open, setOpen] = useState(false)
  const activeCount = (filters.microarea ? 1 : 0) + (filters.bloodPressureStatus ? 1 : 0)

  function apply(partial: Partial<PregnantWomanFilters>) {
    onChange({ ...filters, ...partial, page: 1 })
  }

  function clear() {
    onChange({ page: 1, pageSize: filters.pageSize ?? 20, search: filters.search })
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filtros
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 rounded-md px-1.5 text-[10px]">
              {activeCount}
            </Badge>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          asChild
          className="border-border bg-card z-50 w-[300px] rounded-xl border p-4 shadow-lg"
        >
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between">
              <p className="text-foreground text-sm font-semibold">Filtros</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <FilterBlock label="Microárea">
                <Input
                  placeholder="01, 02, 03..."
                  value={filters.microarea ?? ''}
                  onChange={(e) => apply({ microarea: e.target.value || undefined })}
                />
              </FilterBlock>

              <FilterBlock label="Pressão arterial">
                <div className="flex flex-wrap gap-1.5">
                  {BP_OPTIONS.map((option) => {
                    const active = filters.bloodPressureStatus === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          apply({ bloodPressureStatus: active ? undefined : option.value })
                        }
                        className={cn(
                          'rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors',
                          active
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted',
                        )}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </FilterBlock>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={clear} disabled={activeCount === 0}>
                Limpar
              </Button>
              <Button size="sm" onClick={() => setOpen(false)}>
                Aplicar
              </Button>
            </div>
          </motion.div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

function FilterBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-foreground text-[11px] font-semibold uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  )
}
