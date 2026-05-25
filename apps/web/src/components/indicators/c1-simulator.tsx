'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@repo/ui'

import { C1_DEFINITION, classifyC1, computeC1Percent } from '@/lib/indicators-aps/c1-data'
import { C1BandsLegend } from './c1-bands-legend'
import { C1Gauge } from './c1-gauge'
import {
  AlertCard,
  FormulaCard,
  PopulationCard,
  TargetCard,
  optimalRangeForGiven,
} from './c1-info-cards'

export function C1Simulator() {
  const [programada, setProgramada] = useState<string>('200')
  const [espontanea, setEspontanea] = useState<string>('300')

  const programadaNum = Number(programada) || 0
  const espontaneaNum = Number(espontanea) || 0

  const percent = useMemo(
    () => computeC1Percent(programadaNum, espontaneaNum),
    [programadaNum, espontaneaNum],
  )
  const classification = useMemo(() => classifyC1(percent), [percent])
  const targetRange = useMemo(() => optimalRangeForGiven(espontaneaNum), [espontaneaNum])

  function reset() {
    setProgramada('200')
    setEspontanea('300')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="border-border/60 from-card via-card to-muted/20 overflow-hidden bg-gradient-to-br">
        <CardHeader className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-md font-mono uppercase">
                {C1_DEFINITION.shortLabel}
              </Badge>
              <Badge variant={classification.band.badge as 'secondary'} className="rounded-md">
                {classification.band.label}
              </Badge>
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              {C1_DEFINITION.title}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {C1_DEFINITION.description}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={reset} className="shrink-0 self-start">
            <RotateCcw className="h-3.5 w-3.5" />
            Restaurar exemplo
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="flex justify-center">
            <C1Gauge percent={percent} />
          </div>
          <div className="flex flex-col gap-4">
            <PopulationCard population={C1_DEFINITION.population} />
            <FormulaCard formula={C1_DEFINITION.formula} />
            {classification.alert && <AlertCard kind={classification.alert} />}
            <TargetCard targetRange={targetRange} percent={percent} espontanea={espontaneaNum} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Simulação interativa</CardTitle>
          <CardDescription className="text-xs">
            Informe quantidades de atendimentos para ver o percentual C1 atualizar em tempo real.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Demanda programada"
            description="Consulta agendada, agendada programada, cuidado continuado."
            value={programada}
            onChange={setProgramada}
          />
          <InputField
            label="Demanda espontânea"
            description="Escuta inicial, consulta no dia, atendimento de urgência."
            value={espontanea}
            onChange={setEspontanea}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Parâmetros de avaliação</CardTitle>
          <CardDescription className="text-xs">
            Faixas oficiais. A classificação é por equilíbrio: tanto valores muito baixos quanto
            muito altos resultam em Regular.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <C1BandsLegend percent={percent} />
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface InputFieldProps {
  label: string
  description: string
  value: string
  onChange: (value: string) => void
}

function InputField({ label, description, value, onChange }: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-foreground text-xs font-semibold">{label}</label>
      <Input
        type="number"
        inputMode="numeric"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-muted-foreground text-[11px] leading-relaxed">{description}</p>
    </div>
  )
}
