import { Users } from 'lucide-react'

export function PopulationCard({ population }: { population: string }) {
  return (
    <div className="border-border bg-card flex items-start gap-3 rounded-xl border p-4">
      <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
        <Users className="h-4 w-4" />
      </div>
      <div>
        <p className="text-foreground text-xs font-semibold uppercase tracking-wider">
          População avaliada
        </p>
        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{population}</p>
      </div>
    </div>
  )
}
