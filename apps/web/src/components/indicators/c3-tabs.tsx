'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'
import { Activity, Calculator } from 'lucide-react'

import { cn } from '@repo/ui'
import { INDICATORS } from '@/lib/indicators-aps'
import { C3Dashboard } from './c3-dashboard'
import { IndicatorSimulator } from './indicator-simulator'

type TabKey = 'analise' | 'simulador'

const TABS: Array<{ key: TabKey; label: string; description: string; icon: React.ElementType }> = [
  {
    key: 'analise',
    label: 'Análise',
    description: 'Adesão real das gestantes da sua ESF',
    icon: Activity,
  },
  {
    key: 'simulador',
    label: 'Simulador',
    description: 'Estime a pontuação de uma gestante hipotética',
    icon: Calculator,
  },
]

export function C3Tabs() {
  return (
    <Tabs.Root defaultValue="analise" className="space-y-6">
      <Tabs.List className="border-border bg-card inline-flex items-center gap-1 rounded-xl border p-1 shadow-sm">
        {TABS.map((tab) => (
          <TabTrigger
            key={tab.key}
            value={tab.key}
            label={tab.label}
            description={tab.description}
            icon={tab.icon}
          />
        ))}
      </Tabs.List>

      <Tabs.Content value="analise" asChild>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <C3Dashboard />
        </motion.div>
      </Tabs.Content>

      <Tabs.Content value="simulador" asChild>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <IndicatorSimulator indicator={INDICATORS.c3} />
        </motion.div>
      </Tabs.Content>
    </Tabs.Root>
  )
}

interface TabTriggerProps {
  value: TabKey
  label: string
  description: string
  icon: React.ElementType
}

function TabTrigger({ value, label, icon: Icon }: TabTriggerProps) {
  return (
    <Tabs.Trigger
      value={value}
      className={cn(
        'group relative inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
        'text-muted-foreground hover:text-foreground',
        'data-[state=active]:text-foreground',
        'focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      )}
    >
      <span className="data-[state=active]:bg-muted absolute inset-0 -z-10 rounded-lg opacity-0 transition-opacity group-data-[state=active]:opacity-100" />
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Tabs.Trigger>
  )
}
