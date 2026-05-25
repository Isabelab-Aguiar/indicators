'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { classifyScore, computeScore, type IndicatorDefinition } from '@/lib/indicators-aps'

import { ClassificationRanges } from './classification-ranges'
import { CriteriaRadar } from './criteria-radar'
import { CriterionCard } from './criterion-card'
import { DenominatorField } from './denominator-field'
import { PopulationCard } from './population-card'
import { ScoreMeter } from './score-meter'

interface IndicatorSimulatorProps {
  indicator: IndicatorDefinition
}

export function IndicatorSimulator({ indicator }: IndicatorSimulatorProps) {
  const [achieved, setAchieved] = useState<Set<string>>(new Set())
  const [denominator, setDenominator] = useState<string>('')

  const score = useMemo(() => computeScore(indicator, achieved), [indicator, achieved])
  const classification = useMemo(() => classifyScore(score), [score])
  const adherence = useMemo(() => {
    const target = Number(denominator)
    if (!target || isNaN(target) || target <= 0) return null
    return Math.round((score / 100) * target)
  }, [score, denominator])

  function toggle(id: string) {
    setAchieved((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="border-border/60 from-card via-card to-muted/20 overflow-hidden bg-gradient-to-br">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-md font-mono uppercase">
                {indicator.shortLabel}
              </Badge>
              <Badge
                variant={classification.badge as 'secondary'}
                className="rounded-md font-semibold"
              >
                {classification.label}
              </Badge>
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              {indicator.title}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {indicator.description}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAchieved(new Set())}
            disabled={achieved.size === 0}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Limpar
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <div className="flex flex-col items-center gap-4">
            <ScoreMeter score={score} classification={classification} />
            <p className="text-muted-foreground text-center text-xs leading-relaxed">
              Cada boa prática soma seus pontos integralmente. A média das pessoas avaliadas define
              o resultado da equipe.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <PopulationCard population={indicator.population} />
            <div className="bg-muted/30 rounded-xl p-3">
              <CriteriaRadar criteria={indicator.criteria ?? []} achieved={achieved} />
            </div>
            <DenominatorField value={denominator} onChange={setDenominator} adherence={adherence} />
          </div>
        </CardContent>
      </Card>

      {indicator.criteria && indicator.criteria.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Boas práticas</CardTitle>
            <CardDescription className="text-xs">
              Clique para simular o cumprimento e ver a pontuação total atualizada em tempo real.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {indicator.criteria.map((criterion) => (
              <CriterionCard
                key={criterion.id}
                criterion={criterion}
                achieved={achieved.has(criterion.id)}
                onToggle={() => toggle(criterion.id)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Parâmetros de avaliação</CardTitle>
          <CardDescription className="text-xs">
            Faixas oficiais usadas para classificar a pontuação (0 a 100) por pessoa e por equipe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClassificationRanges active={classification.key} />
        </CardContent>
      </Card>
    </motion.div>
  )
}
