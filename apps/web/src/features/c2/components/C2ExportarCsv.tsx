'use client'

import { Download } from 'lucide-react'
import { Button } from '@repo/ui'
import type { C2Breakdown } from '@repo/types'
import { gerarCsvC2 } from '../services/c2-csv'

interface C2ExportarCsvProps {
  breakdown: C2Breakdown
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

export function C2ExportarCsv({ breakdown }: C2ExportarCsvProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 text-xs"
      disabled={breakdown.total === 0}
      onClick={() => triggerDownload(gerarCsvC2(breakdown), 'c2-desenvolvimento-infantil.csv')}
    >
      <Download className="h-3.5 w-3.5" />
      Exportar CSV
    </Button>
  )
}
