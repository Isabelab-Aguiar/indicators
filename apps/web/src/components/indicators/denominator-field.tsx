import { Info, Sparkles } from 'lucide-react'

import { Input } from '@repo/ui'

interface DenominatorFieldProps {
  value: string
  onChange: (value: string) => void
  adherence: number | null
}

export function DenominatorField({ value, onChange, adherence }: DenominatorFieldProps) {
  return (
    <div className="border-border bg-card rounded-xl border p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="text-primary h-4 w-4" />
        <p className="text-foreground text-xs font-semibold uppercase tracking-wider">
          Projeção populacional (opcional)
        </p>
      </div>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="Ex.: 120 pessoas avaliadas"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sm:max-w-xs"
        />
        {adherence !== null && (
          <p className="text-muted-foreground text-xs">
            Estimativa:{' '}
            <span className="text-foreground font-semibold tabular-nums">{adherence}</span>{' '}
            pessoa(s) cumpririam todas as boas práticas avaliadas.
          </p>
        )}
      </div>
      <div className="text-muted-foreground/80 mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed">
        <Info className="mt-0.5 h-3 w-3 shrink-0" />
        <span>
          Use para projetar a média ponderada da equipe assumindo essa pontuação como referência.
        </span>
      </div>
    </div>
  )
}
