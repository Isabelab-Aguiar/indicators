import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { PregnantWomenTable } from '@/components/pregnant-women/pregnant-women-table'

export const metadata: Metadata = { title: 'Gestantes' }

export default function GestantesPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Gestantes" description="Cadastro e acompanhamento das gestantes da ESF" />
      <div className="flex-1 overflow-y-auto p-6">
        <PregnantWomenTable />
      </div>
    </div>
  )
}
