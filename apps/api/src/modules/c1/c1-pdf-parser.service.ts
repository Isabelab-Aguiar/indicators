import { Injectable, Logger } from '@nestjs/common'
import { C1NormalizationService } from './c1-normalization.service'

export interface C1AtendimentoRow {
  tipoRaw: string
  quantidade: number
}

export interface C1ParsedPdf {
  periodo: string
  atendimentos: C1AtendimentoRow[]
  ignorados: string[]
}

interface PositionedText {
  str: string
  x: number
  y: number
}

interface LineGroup {
  y: number
  text: string
  items: PositionedText[]
}

const Y_TOLERANCE = 2.5

const PERIODO_REGEX = /per[íi]odo[:\s]+(\d{4})\s*[-–]\s*(Q[1-4]|\d{1,2})/i
const QUANTIDADE_LINE_REGEX = /^(.+?)\s+(\d+)\s*$/

@Injectable()
export class C1PdfParserService {
  private readonly logger = new Logger(C1PdfParserService.name)

  constructor(private readonly normalization: C1NormalizationService) {}

  async parse(buffer: Buffer): Promise<C1ParsedPdf> {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
    const doc = await pdfjs.getDocument({
      data: new Uint8Array(buffer),
      disableFontFace: true,
      isEvalSupported: false,
    }).promise

    const allLines: string[] = []
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p)
      const content = await page.getTextContent()
      const items: PositionedText[] = content.items.flatMap((raw) => {
        if (!('str' in raw) || !('transform' in raw)) return []
        const str = (raw as { str: string }).str.trim()
        if (!str) return []
        return [
          {
            str,
            x: (raw as { transform: number[] }).transform[4],
            y: (raw as { transform: number[] }).transform[5],
          },
        ]
      })
      const lines = this.groupLines(items)
      allLines.push(...lines.map((l) => l.text))
    }

    return this.extractData(allLines)
  }

  private groupLines(items: PositionedText[]): LineGroup[] {
    const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x)
    const lines: LineGroup[] = []
    for (const item of sorted) {
      const last = lines[lines.length - 1]
      if (last && Math.abs(last.y - item.y) < Y_TOLERANCE) {
        last.items.push(item)
      } else {
        lines.push({ y: item.y, items: [item], text: '' })
      }
    }
    for (const line of lines) {
      line.items.sort((a, b) => a.x - b.x)
      line.text = line.items
        .map((i) => i.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
    }
    return lines
  }

  private extractData(lines: string[]): C1ParsedPdf {
    let periodo = 'Não identificado'
    const atendimentos: C1AtendimentoRow[] = []
    const ignorados: string[] = []

    for (const line of lines) {
      const periodoMatch = line.match(PERIODO_REGEX)
      if (periodoMatch) {
        periodo = `${periodoMatch[1]}-${periodoMatch[2].toUpperCase()}`
        continue
      }

      const quantMatch = line.match(QUANTIDADE_LINE_REGEX)
      if (quantMatch) {
        const tipoRaw = quantMatch[1].trim()
        const quantidade = parseInt(quantMatch[2], 10)
        const tipo = this.normalization.normalize(tipoRaw)

        if (tipo === 'ignorado') {
          ignorados.push(tipoRaw)
          this.logger.debug(`Tipo ignorado: "${tipoRaw}"`)
        } else {
          atendimentos.push({ tipoRaw, quantidade })
        }
      }
    }

    return { periodo, atendimentos, ignorados }
  }
}
