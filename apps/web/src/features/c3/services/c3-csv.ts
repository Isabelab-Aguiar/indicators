import type { C3Breakdown } from '@/hooks/use-c3-analytics'
import { C3_CRITERIA_DEF } from '@/hooks/use-c3-analytics'

const CRITERIA_IDS = C3_CRITERIA_DEF.map((c) => c.id)

export function gerarCsvC3(breakdown: C3Breakdown): string {
  const header = [
    'Nome',
    'CPF',
    'Microárea',
    'Score (%)',
    'Classificação',
    ...CRITERIA_IDS.map((id) => `Critério ${id}`),
  ].join(',')

  const rows = breakdown.patients.map((p) =>
    [
      `"${p.name.replace(/"/g, '""')}"`,
      p.cpf,
      p.microarea,
      p.pctScore.toFixed(1),
      p.classification,
      ...CRITERIA_IDS.map((id) => (p.criteriaMet.includes(id) ? 'Sim' : 'Não')),
    ].join(','),
  )

  return [header, ...rows].join('\n')
}
