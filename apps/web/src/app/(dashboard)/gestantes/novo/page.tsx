import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { PregnantWomanForm } from '@/components/pregnant-women/pregnant-woman-form'

export const metadata: Metadata = { title: 'Nova gestante' }

export default function NovaGestantePage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Nova gestante" description="Cadastrar gestante manualmente" />
      <div className="flex-1 overflow-y-auto p-6">
        <PregnantWomanForm />
      </div>
    </div>
  )
}
