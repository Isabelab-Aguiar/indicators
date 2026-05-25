import type { Metadata } from 'next'
import { C1Dashboard } from '@/features/c1/components/C1Dashboard'

export const metadata: Metadata = {
  title: 'C1 · Mais Acesso à APS · Indicadores APS',
}

export default function C1IndicadorPage() {
  return <C1Dashboard />
}
