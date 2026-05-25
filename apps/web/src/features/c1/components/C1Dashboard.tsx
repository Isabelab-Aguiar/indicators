'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useC1Analytics } from '../hooks/useC1Analytics'
import { useC1Execucoes } from '../hooks/useC1Execucoes'
import { C1Header } from './C1Header'
import { C1KpiCards } from './C1KpiCards'
import { C1GaugeSection } from './C1GaugeSection'
import { C1Analytics } from './C1Analytics'
import { C1TabelaExecucoes } from './C1TabelaExecucoes'
import { C1Insights } from './C1Insights'
import { C1ImportacaoPdf } from './C1ImportacaoPdf'
import { C1SimuladorSection } from './C1SimuladorSection'

const SECTION_TABS = ['Visão Geral', 'Analytics', 'Histórico', 'Simulador'] as const
type SectionTab = (typeof SECTION_TABS)[number]

export function C1Dashboard() {
  const [showImport, setShowImport] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionTab>('Visão Geral')

  const { data: analytics, isLoading: analyticsLoading } = useC1Analytics()
  const { data: execucoes, isLoading: execucoesLoading } = useC1Execucoes()

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <C1Header onImportClick={() => setShowImport((v) => !v)} />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
          <AnimatePresence>
            {showImport && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <C1ImportacaoPdf onClose={() => setShowImport(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="border-border flex flex-wrap gap-1 border-b pb-2">
            {SECTION_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSection(tab)}
                className={
                  activeSection === tab
                    ? 'bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg px-3 py-1.5 text-xs font-medium transition-colors'
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {activeSection === 'Visão Geral' && (
            <motion.div
              key="visao-geral"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              <C1KpiCards analytics={analytics} isLoading={analyticsLoading} />

              <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
                <C1GaugeSection analytics={analytics} isLoading={analyticsLoading} />
                <C1Insights analytics={analytics} isLoading={analyticsLoading} />
              </div>
            </motion.div>
          )}

          {activeSection === 'Analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <C1Analytics analytics={analytics} isLoading={analyticsLoading} />
            </motion.div>
          )}

          {activeSection === 'Histórico' && (
            <motion.div key="historico" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <C1TabelaExecucoes execucoes={execucoes} isLoading={execucoesLoading} />
            </motion.div>
          )}

          {activeSection === 'Simulador' && (
            <motion.div key="simulador" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <C1SimuladorSection />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
