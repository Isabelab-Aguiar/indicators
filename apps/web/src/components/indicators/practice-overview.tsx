'use client'

import { motion } from 'framer-motion'
import { Award, ChartLine, ClipboardCheck, ScrollText } from 'lucide-react'

import { Card } from '@repo/ui'
import { CLASSIFICATIONS } from '@/lib/indicators-aps'

const HIGHLIGHTS = [
  {
    icon: ClipboardCheck,
    title: '100 pontos por pessoa',
    description: 'Cada boa prática é tudo ou nada: cumpriu, soma o peso completo.',
  },
  {
    icon: ChartLine,
    title: 'Média aritmética por equipe',
    description: 'O resultado da ESF é a média das pontuações individuais das pessoas avaliadas.',
  },
  {
    icon: ScrollText,
    title: 'Fonte: Previne Brasil',
    description: 'Indicadores oficiais para o cuidado APS conforme regulamentação ministerial.',
  },
]

const BADGE_BG: Record<(typeof CLASSIFICATIONS)[number]['badge'], string> = {
  success: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  info: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  destructive: 'bg-red-500/15 text-red-700 dark:text-red-300',
}

export function PracticeOverview() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="border-border/60 p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-foreground text-sm font-semibold">{title}</p>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-border/60 p-5">
        <div className="flex items-center gap-2">
          <Award className="text-primary h-4 w-4" />
          <p className="text-foreground text-sm font-semibold">Faixas de classificação</p>
        </div>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          A classificação se aplica tanto à pontuação individual quanto à média da equipe.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {CLASSIFICATIONS.map((c) => (
            <div key={c.key} className="border-border bg-card rounded-xl border p-3">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${BADGE_BG[c.badge]}`}
              >
                {c.label}
              </span>
              <p className="text-foreground mt-2 text-xs font-medium tabular-nums">{c.range}</p>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
