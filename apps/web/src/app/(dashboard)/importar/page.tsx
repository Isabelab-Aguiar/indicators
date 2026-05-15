import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { ImportSection } from '@/components/imports/import-section'
import { ImportHistory } from '@/components/imports/import-history'

export const metadata: Metadata = { title: 'Importar' }

export default function ImportarPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Importar Dados" description="Importe gestantes via CSV ou PDF" />
      <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
        <ImportSection />
        <ImportHistory />
      </div>
    </div>
  )
}
