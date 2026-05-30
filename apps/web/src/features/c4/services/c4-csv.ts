import type { C4Breakdown } from '@/hooks/use-c4-analytics'
import { C4_CRITERIA_DEF } from '@/hooks/use-c4-analytics'

const CRITERIA_IDS = C4_CRITERIA_DEF.map((c) => c.id)

export function gerarCsvC4(breakdown: C4Breakdown): string {
  const header = [
    'Nome',
    'Microárea',
    'ACS',
    'Score (%)',
    'Classificação',
    ...CRITERIA_IDS.map((id) => `Critério ${id}`),
    'Critérios Pendentes',
  ].join(',')

  const rows = breakdown.patients.map((p) =>
    [
      `"${p.name.replace(/"/g, '""')}"`,
      p.microarea,
      p.acs,
      p.score.toFixed(1),
      p.classification,
      ...CRITERIA_IDS.map((id) => (p.criteria[id] ? 'Sim' : 'Não')),
      p.pendingCriteria.join(';'),
    ].join(','),
  )

  return [header, ...rows].join('\n')
}
