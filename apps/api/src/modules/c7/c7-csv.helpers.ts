import { BadRequestException } from '@nestjs/common'

export const ESUS_SEPARATOR = ';'

export const ESUS_COL = {
  NOME: 'Nome',
  DATA_NASCIMENTO: 'Data de nascimento',
  MICROAREA: 'Microárea',
  CITOLOGIA_DATA_AVALIACAO:
    'Exame de rastreamento de câncer de colo de útero data última avaliação',
  CITOLOGIA_DATA_SOLICITACAO:
    'Exame de rastreamento de câncer de colo de útero data última solicitação',
  HPV: 'HPV',
  SAUDE_SEXUAL: 'Data da última consulta de saúde sexual e reprodutiva',
  MAMOGRAFIA_DATA_REALIZACAO: 'Exame de rastreamento de câncer de mama data Última realização',
  MAMOGRAFIA_DATA_AVALIACAO: 'Exame de rastreamento de câncer de mama data Última avaliação',
  MAMOGRAFIA_DATA_SOLICITACAO: 'Exame de rastreamento de câncer de mama data Última solicitação',
} as const

export function parseEsusCsv(csvContent: string): Record<string, string>[] {
  const lines = csvContent.split('\n').map((l) => l.trimEnd())
  const headerLineIndex = lines.findIndex((l) => l.startsWith('Nome' + ESUS_SEPARATOR))

  if (headerLineIndex === -1) {
    throw new BadRequestException(
      'Formato de CSV não reconhecido. Exporte o relatório "Saúde da mulher" do Acompanhamento de Condições de Saúde do e-SUS.',
    )
  }

  const columns = lines[headerLineIndex]
    .split(ESUS_SEPARATOR)
    .map((h) => h.trim().replace(/^"|"$/g, ''))

  return lines
    .slice(headerLineIndex + 1)
    .filter((l) => l.trim().length > 0)
    .map((line) => {
      const fields = line.split(ESUS_SEPARATOR).map((f) => f.trim().replace(/^"|"$/g, ''))
      const row: Record<string, string> = {}
      columns.forEach((col, i) => {
        row[col] = fields[i] ?? ''
      })
      return row
    })
}
