import type { C7Breakdown } from '@/hooks/use-c7-analytics'
import { C7_CRITERIA_DEF } from '@/hooks/use-c7-analytics'

const CRITERIA_IDS = C7_CRITERIA_DEF.map((c) => c.id)

export function gerarCsvC7(breakdown: C7Breakdown): string {
  const header = [
    'Nome',
    'Idade',
    'Microárea',
    'Score (%)',
    'Score Máx (pts)',
    'Classificação',
    ...CRITERIA_IDS.map((id) => `Critério ${id}`),
    ...CRITERIA_IDS.map((id) => `Elegível ${id}`),
    'Critérios Pendentes',
  ].join(',')

  const rows = breakdown.patients.map((p) =>
    [
      `"${p.name.replace(/"/g, '""')}"`,
      p.age,
      p.microarea,
      p.pctScore.toFixed(1),
      p.scoreMax,
      p.classification,
      ...CRITERIA_IDS.map((id) => (p.criteria[id] ? 'Sim' : 'Não')),
      ...CRITERIA_IDS.map((id) => (p.eligibility[id] ? 'Sim' : 'Não')),
      p.pendingCriteria.join(';'),
    ].join(','),
  )

  return [header, ...rows].join('\n')
}
