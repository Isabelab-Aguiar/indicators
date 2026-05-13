import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { PregnantWomanDetail } from '@/components/pregnant-women/pregnant-woman-detail'

export const metadata: Metadata = { title: 'Gestante' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function GestanteDetailPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Detalhes da Gestante" description="Visualização completa do prontuário" />
      <div className="flex-1 overflow-y-auto p-6">
        <PregnantWomanDetail id={id} />
      </div>
    </div>
  )
}
