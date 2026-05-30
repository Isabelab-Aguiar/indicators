'use client'

import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@repo/ui'
import { QUADRIMESTRE_OPTIONS, buildYearOptions, type Quadrimestre } from '@/lib/quadrimestre'

interface C4FiltersProps {
  quad: Quadrimestre
  year: number
  microarea: string
  microareaOptions: string[]
  onQuadChange: (value: Quadrimestre) => void
  onYearChange: (value: number) => void
  onMicroareaChange: (value: string) => void
}

const ALL = '__all__'

export function C4Filters({
  quad,
  year,
  microarea,
  microareaOptions,
  onQuadChange,
  onYearChange,
  onMicroareaChange,
}: C4FiltersProps) {
  const years = buildYearOptions(new Date().getFullYear())
  return (
    <div className="border-border bg-card flex flex-wrap items-end gap-3 rounded-2xl border p-4">
      <FilterField label="Quadrimestre">
        <FilterSelect
          value={String(quad)}
          onValueChange={(v) => onQuadChange(Number(v) as Quadrimestre)}
        >
          {QUADRIMESTRE_OPTIONS.map((opt) => (
            <FilterItem key={opt.value} value={String(opt.value)}>
              {opt.label}
            </FilterItem>
          ))}
        </FilterSelect>
      </FilterField>
      <FilterField label="Ano">
        <FilterSelect value={String(year)} onValueChange={(v) => onYearChange(Number(v))}>
          {years.map((y) => (
            <FilterItem key={y} value={String(y)}>
              {y}
            </FilterItem>
          ))}
        </FilterSelect>
      </FilterField>
      <FilterField label="Microarea">
        <FilterSelect
          value={microarea === '' ? ALL : microarea}
          onValueChange={(v) => onMicroareaChange(v === ALL ? '' : v)}
        >
          <FilterItem value={ALL}>Todas</FilterItem>
          {microareaOptions.map((m) => (
            <FilterItem key={m} value={m}>
              {m}
            </FilterItem>
          ))}
        </FilterSelect>
      </FilterField>
    </div>
  )
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-[160px] flex-col gap-1.5">
      <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
        {label}
      </span>
      {children}
    </div>
  )
}

function FilterSelect({
  value,
  onValueChange,
  children,
}: {
  value: string
  onValueChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className={cn(
          'border-border bg-background text-foreground hover:bg-muted/40 focus:ring-ring data-[placeholder]:text-muted-foreground inline-flex h-9 items-center justify-between gap-2 rounded-lg border px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
        )}
      >
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="text-muted-foreground h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="border-border bg-card z-50 overflow-hidden rounded-xl border shadow-lg"
        >
          <Select.Viewport className="p-1">{children}</Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

function FilterItem({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <Select.Item
      value={value}
      className={cn(
        'text-foreground data-[highlighted]:bg-muted relative flex h-8 cursor-pointer select-none items-center gap-2 rounded-md px-2 pr-7 text-sm outline-none data-[state=checked]:font-semibold',
      )}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute right-2 inline-flex items-center">
        <Check className="text-primary h-3.5 w-3.5" />
      </Select.ItemIndicator>
    </Select.Item>
  )
}
