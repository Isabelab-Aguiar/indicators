import { BadRequestException } from '@nestjs/common'

export const ESUS_SEPARATOR = ';'

export const ESUS_COL = {
  NOME: 'Nome',
  DATA_NASCIMENTO: 'Data de nascimento',
  DATA_PRIMEIRA_CONSULTA: 'Data da primeira consulta',
  QTD_CONSULTAS: 'Quantidade de consultas até 24 meses',
  QTD_MEDICOES: 'Quantidade de medições de peso/altura simultâneas até 24 meses',
  DATA_PRIMEIRA_VISITA: 'Data da primeira visita domiciliar',
  DATA_SEGUNDA_VISITA: 'Data da segunda visita domiciliar',
  VACINA_PENTA: 'Difteria, Tétano, Pertusis, Hepatite B, Haemophilus Influenza B',
  VACINA_POLIO: 'Poliomielite',
  VACINA_SCR: 'Sarampo, Caxumba, Rubéola',
  VACINA_PNEUMO: 'Pneumocócica',
} as const

export function parseEsusCsv(csvContent: string): Record<string, string>[] {
  const lines = csvContent.split('\n').map((l) => l.trimEnd())

  const headerLineIndex = lines.findIndex((l) => l.startsWith('Nome' + ESUS_SEPARATOR))

  if (headerLineIndex === -1) {
    throw new BadRequestException(
      'Formato de CSV não reconhecido. Exporte o relatório de Acompanhamento de Condições de Saúde do e-SUS.',
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
