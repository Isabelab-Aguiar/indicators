'use client'

import { Download } from 'lucide-react'
import { Button } from '@repo/ui'
import type { C6Breakdown } from '@/hooks/use-c6-analytics'
import { gerarCsvC6 } from '../services/c6-csv'

interface C6ExportarCsvProps {
  breakdown: C6Breakdown
}

function triggerDownload(content: string, filename: string) {
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export function C6ExportarCsv({ breakdown }: C6ExportarCsvProps) {
  function handleExport() {
    triggerDownload(gerarCsvC6(breakdown), 'c6-pessoa-idosa.csv')
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
