import { AlertTriangle, Calculator, TrendingUp, Users } from 'lucide-react'

export function PopulationCard({ population }: { population: string }) {
  return (
    <InfoCard icon={Users} title="População avaliada">
      {population}
    </InfoCard>
  )
}

export function FormulaCard({ formula }: { formula: string }) {
  return (
    <InfoCard icon={Calculator} title="Fórmula">
      <code className="bg-muted/60 inline-block rounded-md px-2 py-0.5 font-mono text-[11px]">
        {formula}
      </code>
    </InfoCard>
  )
}

export function AlertCard({ kind }: { kind: 'too-high' | 'too-low' }) {
  const message =
    kind === 'too-high'
      ? 'Acima de 70%: baixa abertura à demanda espontânea. Avalie ampliar acolhimento.'
      : 'Até 10%: equipe operando quase exclusivamente com demanda espontânea. Avalie programar mais consultas.'
  return (
    <div className="border-destructive/30 bg-destructive/5 flex items-start gap-3 rounded-xl border p-4">
      <div className="bg-destructive/10 text-destructive flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
        <AlertTriangle className="h-4 w-4" />
      </div>
      <div>
        <p className="text-destructive text-xs font-semibold uppercase tracking-wider">
          Alerta operacional
        </p>
        <p className="text-foreground mt-1 text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  )
}

interface TargetCardProps {
  targetRange: { min: number; max: number } | null
  percent: number
  espontanea: number
}

export function TargetCard({ targetRange, percent, espontanea }: TargetCardProps) {
  if (!targetRange) {
    return (
      <InfoCard icon={TrendingUp} title="Zona ótima">
        Informe a demanda espontânea para projetar o intervalo recomendado de programadas.
      </InfoCard>
    )
  }
  return (
    <InfoCard icon={TrendingUp} title="Zona ótima (50% a 70%)">
      Para classificar como <strong>Ótimo</strong> com {espontanea} atendimentos espontâneos,
      mantenha entre <strong className="tabular-nums">{targetRange.min}</strong> e{' '}
      <strong className="tabular-nums">{targetRange.max}</strong> programados. Atual:{' '}
      <strong className="tabular-nums">{percent.toFixed(1)}%</strong>.
    </InfoCard>
  )
}

interface InfoCardProps {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}

function InfoCard({ icon: Icon, title, children }: InfoCardProps) {
  return (
    <div className="border-border bg-card flex items-start gap-3 rounded-xl border p-4">
      <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-foreground text-xs font-semibold uppercase tracking-wider">{title}</p>
        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  )
}

export function optimalRangeForGiven(espontanea: number): { min: number; max: number } | null {
  if (espontanea <= 0) return null
  const min = Math.ceil(espontanea)
  const max = Math.floor((0.7 * espontanea) / 0.3)
  return { min, max }
}
