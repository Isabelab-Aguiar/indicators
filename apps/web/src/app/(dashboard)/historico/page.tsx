import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = { title: 'Histórico' }

export default function HistoricoPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Histórico de Auditoria"
        description="Registro de todas as ações realizadas na ESF"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-muted-foreground text-sm">Em desenvolvimento.</p>
      </div>
    </div>
  )
}
