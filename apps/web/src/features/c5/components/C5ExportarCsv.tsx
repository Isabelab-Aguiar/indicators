'use client'

import { Download } from 'lucide-react'
import { Button } from '@repo/ui'
import type { C5Breakdown } from '@/hooks/use-c5-analytics'
import { gerarCsvC5 } from '../services/c5-csv'

interface C5ExportarCsvProps {
  breakdown: C5Breakdown
}

function triggerDownload(content: string, filename: string) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export function C5ExportarCsv({ breakdown }: C5ExportarCsvProps) {
  function handleExport() {
    triggerDownload(gerarCsvC5(breakdown), 'c5-hipertensao.csv')
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 text-xs"
      disabled={breakdown.total === 0}
      onClick={handleExport}
    >
      <Download className="h-3.5 w-3.5" />
      Exportar CSV
    </Button>
  )
}
