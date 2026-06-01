'use client'

import { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'
import { Activity, Calculator, Upload } from 'lucide-react'
import { cn } from '@repo/ui'
import { INDICATORS } from '@/lib/indicators-aps'
import { useC3Analytics } from '@/hooks/use-c3-analytics'
import { ImportHistory } from '@/components/imports/import-history'
import { C3ImportacaoSection } from '@/features/c3/components/C3ImportacaoSection'
import { C3ExportarCsv } from '@/features/c3/components/C3ExportarCsv'
import { C3Dashboard } from './c3-dashboard'
import { IndicatorSimulator } from './indicator-simulator'
import { IndicatorFilters } from '@/components/layout/indicator-toolbar'

type TabKey = 'analise' | 'importar' | 'simulador'

const TABS: Array<{ key: TabKey; label: string; icon: React.ElementType }> = [
  { key: 'analise', label: 'Análise', icon: Activity },
  { key: 'importar', label: 'Importar', icon: Upload },
  { key: 'simulador', label: 'Simulador', icon: Calculator },
]

function TabTrigger({
  value,
  label,
  icon: Icon,
}: {
  value: TabKey
  label: string
  icon: React.ElementType
}) {
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

export function C3Tabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('analise')
  const { breakdown } = useC3Analytics()

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as TabKey)}
      className="space-y-6"
    >
      <div className="border-border flex flex-wrap items-center justify-between gap-2 border-b pb-3">
        <Tabs.List className="border-border bg-card inline-flex items-center gap-1 rounded-xl border p-1 shadow-sm">
          {TABS.map((tab) => (
            <TabTrigger key={tab.key} value={tab.key} label={tab.label} icon={tab.icon} />
          ))}
        </Tabs.List>
        <IndicatorFilters
          hideOnTabs={['importar', 'simulador']}
          activeTab={activeTab}
          exportSlot={activeTab === 'analise' ? <C3ExportarCsv breakdown={breakdown} /> : undefined}
        />
      </div>

      <Tabs.Content value="analise" asChild>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <C3Dashboard />
        </motion.div>
      </Tabs.Content>

      <Tabs.Content value="importar" asChild>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <C3ImportacaoSection />
          <ImportHistory />
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
