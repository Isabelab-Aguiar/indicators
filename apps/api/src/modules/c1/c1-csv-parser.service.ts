import { Injectable } from '@nestjs/common'
import { C1NormalizationService } from './c1-normalization.service'
import type { C1AtendimentoRow, C1ParsedPdf } from './c1-pdf-parser.service'

const PERIODO_REGEX = /per[íi]odo[:\s]+(\d{4})\s*[-–]\s*(Q[1-4]|\d{1,2})/i

@Injectable()
export class C1CsvParserService {
  constructor(private readonly normalization: C1NormalizationService) {}

  parse(buffer: Buffer): C1ParsedPdf {
    const text = buffer.toString('latin1').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)

    const sep = this.detectSeparator(lines)
    let periodo = 'Não identificado'

    for (const line of lines.slice(0, 25)) {
      const m = line.match(PERIODO_REGEX)
      if (m) {
        periodo = `${m[1]}-${m[2].toUpperCase()}`
        break
      }
    }

    const headerIdx = lines.findIndex((l) => {
      const lower = l.toLowerCase()
      return lower.includes('tipo') || lower.includes('atendimento')
    })

    if (headerIdx === -1) return { periodo, atendimentos: [], ignorados: [] }

    const headers = this.split(lines[headerIdx], sep).map((h) => h.toLowerCase().trim())
    const tipoIdx = headers.findIndex((h) => h.includes('tipo') || h.includes('atendimento'))
    const qtdIdx = headers.findIndex(
      (h) => h.includes('quant') || h === 'qtd' || h === 'n' || h === 'total',
    )

    const countMap = new Map<string, number>()
    const ignorados: string[] = []

    for (const line of lines.slice(headerIdx + 1)) {
      const cols = this.split(line, sep)
      if (cols.length <= tipoIdx) continue
      const tipoRaw = cols[tipoIdx].replace(/^"|"$/g, '').trim()
      if (!tipoRaw) continue

      const tipo = this.normalization.normalize(tipoRaw)
      if (tipo === 'ignorado') {
        ignorados.push(tipoRaw)
        continue
      }

      const qty = qtdIdx !== -1 ? parseInt(cols[qtdIdx]?.replace(/\D/g, '') ?? '', 10) : NaN

      countMap.set(tipoRaw, (countMap.get(tipoRaw) ?? 0) + (isNaN(qty) || qty <= 0 ? 1 : qty))
    }

    const atendimentos: C1AtendimentoRow[] = [...countMap.entries()].map(
      ([tipoRaw, quantidade]) => ({ tipoRaw, quantidade }),
    )

    return { periodo, atendimentos, ignorados }
  }

  private detectSeparator(lines: string[]): string {
    const sample = lines.slice(0, 10).join('\n')
    return sample.split(';').length >= sample.split(',').length ? ';' : ','
  }

  private split(line: string, sep: string): string[] {
    return line.split(sep)
  }
}
