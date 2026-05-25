'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { Badge, Card, CardContent, CardHeader } from '@repo/ui'
import type { IndicatorDefinition } from '@/lib/indicators-aps'

interface PracticeDetailProps {
  indicator: IndicatorDefinition
  accent: string
}

export function PracticeDetail({ indicator, accent }: PracticeDetailProps) {
  return (
    <Card id={indicator.code} className="border-border/60 scroll-mt-24 overflow-hidden">
      <div className={`bg-gradient-to-r ${accent} h-1`} />
      <CardHeader className="space-y-2 pb-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-md font-mono uppercase">
            {indicator.shortLabel}
          </Badge>
          {indicator.maxScore && (
            <Badge variant="outline" className="rounded-md text-[11px] font-medium">
              {indicator.maxScore} pontos
            </Badge>
          )}
          {!indicator.maxScore && (
            <Badge variant="outline" className="rounded-md text-[11px] font-medium">
              Percentual
            </Badge>
          )}
        </div>
        <div>
          <h2 className="text-foreground text-xl font-semibold tracking-tight">
            {indicator.title}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">{indicator.subtitle}</p>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">{indicator.description}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <PopulationBlock population={indicator.population} />
        {indicator.criteria && <CriteriaList indicator={indicator} />}
        {indicator.bands && <BandsList indicator={indicator} />}
        <SimulatorLink code={indicator.code} />
      </CardContent>
    </Card>
  )
}

function PopulationBlock({ population }: { population: string }) {
  return (
    <div className="bg-muted/30 rounded-xl p-4">
      <p className="text-foreground text-[11px] font-semibold uppercase tracking-wider">
        População avaliada
      </p>
      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{population}</p>
    </div>
  )
}

function CriteriaList({ indicator }: { indicator: IndicatorDefinition }) {
  return (
    <div>
      <p className="text-foreground mb-3 text-[11px] font-semibold uppercase tracking-wider">
        Boas práticas e pontuação
      </p>
      <ol className="space-y-2">
        {indicator.criteria!.map((criterion) => (
          <li
            key={criterion.id}
            className="border-border bg-card flex items-start gap-3 rounded-xl border p-3"
          >
            <div className="bg-muted text-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
              {criterion.id}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-foreground text-sm font-semibold leading-snug">
                  {criterion.title}
                </p>
                <span className="text-muted-foreground shrink-0 text-xs font-semibold tabular-nums">
                  {criterion.points} pts
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                {criterion.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function BandsList({ indicator }: { indicator: IndicatorDefinition }) {
  return (
    <div>
      <p className="text-foreground mb-3 text-[11px] font-semibold uppercase tracking-wider">
        Classificações e faixas
      </p>
      <ol className="space-y-2">
        {indicator.bands!.map((band) => (
          <li
            key={band.label}
            className="border-border bg-card flex items-start gap-3 rounded-xl border p-3"
          >
            <div className="bg-muted text-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold">
              {band.label.slice(0, 3)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-foreground text-sm font-semibold leading-snug">{band.label}</p>
                <span className="text-muted-foreground shrink-0 text-xs font-semibold tabular-nums">
                  {band.range}
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                {band.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function SimulatorLink({ code }: { code: string }) {
  return (
    <Link
      href={`/indicadores/${code}`}
      className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
    >
      Abrir simulador interativo
      <ArrowUpRight className="h-3.5 w-3.5" />
    </Link>
  )
}
