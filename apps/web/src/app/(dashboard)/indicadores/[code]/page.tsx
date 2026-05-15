import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Header } from '@/components/layout/header'
import { IndicatorSimulator } from '@/components/indicators/indicator-simulator'
import { INDICATORS, type IndicatorCode } from '@/lib/indicators-aps'

interface Props {
  params: Promise<{ code: string }>
}

const VALID_CODES = Object.keys(INDICATORS) as IndicatorCode[]

function isIndicatorCode(value: string): value is IndicatorCode {
  return (VALID_CODES as string[]).includes(value)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  if (!isIndicatorCode(code)) return { title: 'Indicador APS' }
  const indicator = INDICATORS[code]
  return { title: `${indicator.shortLabel} · ${indicator.title}` }
}

export default async function IndicatorPage({ params }: Props) {
  const { code } = await params
  if (!isIndicatorCode(code)) notFound()
  const indicator = INDICATORS[code]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title={`${indicator.shortLabel} · ${indicator.title}`}
        description={indicator.subtitle}
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <IndicatorSimulator indicator={indicator} />
      </div>
    </div>
  )
}
