'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'
import { Activity, Calculator, Upload } from 'lucide-react'
import { cn } from '@repo/ui'
import { INDICATORS } from '@/lib/indicators-aps'
import { useC5Analytics } from '@/hooks/use-c5-analytics'
import { C5ImportacaoSection } from '@/features/c5/components/C5ImportacaoSection'
import { C5ExportarCsv } from '@/features/c5/components/C5ExportarCsv'
import { C5Dashboard } from './c5-dashboard'
import { IndicatorSimulator } from './indicator-simulator'

type TabKey = 'analise' | 'importar' | 'simulador'

const TABS: Array<{ key: TabKey; label: string; icon: React.ElementType }> = [
  { key: 'analise', label: 'Análise', icon: Activity },
  { key: 'importar', label: 'Importar', icon: Upload },
  { key: 'simulador', label: 'Simulador', icon: Calculator },
]

export function C5Tabs() {
  const { breakdown } = useC5Analytics()

  return (
    <Tabs.Root defaultValue="analise" className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Tabs.List className="border-border bg-card inline-flex items-center gap-1 rounded-xl border p-1 shadow-sm">
          {TABS.map((tab) => (
            <TabTrigger key={tab.key} value={tab.key} label={tab.label} icon={tab.icon} />
          ))}
        </Tabs.List>

        <Tabs.Content value="analise" asChild>
          <div>
            <C5ExportarCsv breakdown={breakdown} />
          </div>
        </Tabs.Content>
      </div>

      <Tabs.Content value="analise" asChild>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <C5Dashboard />
        </motion.div>
      </Tabs.Content>

      <Tabs.Content value="importar" asChild>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <C5ImportacaoSection />
        </motion.div>
      </Tabs.Content>

      <Tabs.Content value="simulador" asChild>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <IndicatorSimulator indicator={INDICATORS.c5} />
        </motion.div>
      </Tabs.Content>
    </Tabs.Root>
  )
}

interface TabTriggerProps {
  value: TabKey
  label: string
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
