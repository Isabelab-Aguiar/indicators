'use client'

import { Download } from 'lucide-react'
import { Button } from '@repo/ui'
import type { C4Breakdown } from '@/hooks/use-c4-analytics'
import { gerarCsvC4 } from '../services/c4-csv'

interface C4ExportarCsvProps {
  breakdown: C4Breakdown
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

export function C4ExportarCsv({ breakdown }: C4ExportarCsvProps) {
  function handleExport() {
    triggerDownload(gerarCsvC4(breakdown), 'c4-diabetes.csv')
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
