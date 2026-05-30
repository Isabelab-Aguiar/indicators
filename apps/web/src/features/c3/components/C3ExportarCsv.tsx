'use client'

import { Download } from 'lucide-react'
import { Button } from '@repo/ui'
import type { C3Breakdown } from '@/hooks/use-c3-analytics'
import { gerarCsvC3 } from '../services/c3-csv'

interface C3ExportarCsvProps {
  breakdown: C3Breakdown
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

export function C3ExportarCsv({ breakdown }: C3ExportarCsvProps) {
  function handleExport() {
    triggerDownload(gerarCsvC3(breakdown), 'c3-pre-natal.csv')
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
