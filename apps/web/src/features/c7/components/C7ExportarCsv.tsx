'use client'

import { Download } from 'lucide-react'
import { Button } from '@repo/ui'
import type { C7Breakdown } from '@/hooks/use-c7-analytics'
import { gerarCsvC7 } from '../services/c7-csv'

interface C7ExportarCsvProps {
  breakdown: C7Breakdown
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

export function C7ExportarCsv({ breakdown }: C7ExportarCsvProps) {
  function handleExport() {
    triggerDownload(gerarCsvC7(breakdown), 'c7-prevencao-cancer.csv')
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
