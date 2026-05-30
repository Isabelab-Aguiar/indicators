'use client'

import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@repo/ui'
import { QUADRIMESTRE_OPTIONS, buildYearOptions, type Quadrimestre } from '@/lib/quadrimestre'

export type AgeRangeC6 = '60-69' | '70-79' | '80+' | ''

const AGE_RANGE_OPTIONS: { value: AgeRangeC6; label: string }[] = [
  { value: '', label: 'Todas' },
  { value: '60-69', label: '60 a 69 anos' },
  { value: '70-79', label: '70 a 79 anos' },
  { value: '80+', label: '80 anos ou mais' },
]

const ALL_MICROAREAS = '__all__'

interface C6FiltersProps {
  quad: Quadrimestre
  year: number
  microarea: string
  ageRange: AgeRangeC6
  microareaOptions: string[]
  onQuadChange: (value: Quadrimestre) => void
  onYearChange: (value: number) => void
  onMicroareaChange: (value: string) => void
  onAgeRangeChange: (value: AgeRangeC6) => void
}

export function C6Filters({
  quad,
  year,
  microarea,
  ageRange,
  microareaOptions,
  onQuadChange,
  onYearChange,
  onMicroareaChange,
  onAgeRangeChange,
}: C6FiltersProps) {
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

      <FilterField label="Microárea">
        <FilterSelect
          value={microarea === '' ? ALL_MICROAREAS : microarea}
          onValueChange={(v) => onMicroareaChange(v === ALL_MICROAREAS ? '' : v)}
        >
          <FilterItem value={ALL_MICROAREAS}>Todas</FilterItem>
          {microareaOptions.map((m) => (
            <FilterItem key={m} value={m}>
              {m}
            </FilterItem>
          ))}
        </FilterSelect>
      </FilterField>

      <FilterField label="Faixa etária">
        <FilterSelect
          value={ageRange === '' ? '__all_ages__' : ageRange}
          onValueChange={(v) => onAgeRangeChange(v === '__all_ages__' ? '' : (v as AgeRangeC6))}
        >
          {AGE_RANGE_OPTIONS.map((opt) => (
            <FilterItem key={opt.value || '__all_ages__'} value={opt.value || '__all_ages__'}>
              {opt.label}
            </FilterItem>
          ))}
        </FilterSelect>
      </FilterField>
    </div>
  )
}

interface FilterFieldProps {
  label: string
  children: React.ReactNode
}
function FilterField({ label, children }: FilterFieldProps) {
  return (
    <div className="flex min-w-[160px] flex-col gap-1.5">
      <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
        {label}
      </span>
      {children}
    </div>
  )
}

interface FilterSelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}
function FilterSelect({ value, onValueChange, children }: FilterSelectProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className={cn(
          'border-border bg-background text-foreground inline-flex h-9 items-center justify-between gap-2 rounded-lg border px-3 text-sm',
          'hover:bg-muted/40 transition-colors',
          'focus:ring-ring focus:outline-none focus:ring-2 focus:ring-offset-1',
          'data-[placeholder]:text-muted-foreground',
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

interface FilterItemProps {
  value: string
  children: React.ReactNode
}
function FilterItem({ value, children }: FilterItemProps) {
  return (
    <Select.Item
      value={value}
      className={cn(
        'text-foreground relative flex h-8 cursor-pointer select-none items-center gap-2 rounded-md px-2 pr-7 text-sm outline-none',
        'data-[highlighted]:bg-muted data-[state=checked]:font-semibold',
      )}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute right-2 inline-flex items-center">
        <Check className="text-primary h-3.5 w-3.5" />
      </Select.ItemIndicator>
    </Select.Item>
  )
}
