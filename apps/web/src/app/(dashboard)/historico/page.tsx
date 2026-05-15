import type { Metadata } from 'next'

import { AuditLogList } from '@/components/audit/audit-log-list'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = { title: 'Histórico' }

export default function HistoricoPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Histórico de Auditoria"
        description="Registro de ações realizadas na sua ESF"
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <AuditLogList />
      </div>
    </div>
  )
}
