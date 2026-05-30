import type { C6Breakdown } from '@/hooks/use-c6-analytics'
import { C6_CRITERIA_DEF } from '@/hooks/use-c6-analytics'

const CRITERIA_IDS = C6_CRITERIA_DEF.map((c) => c.id)

export function gerarCsvC6(breakdown: C6Breakdown): string {
  const header = [
    'Nome',
    'Idade',
    'Microárea',
    'Score (%)',
    'Classificação',
    ...CRITERIA_IDS.map((id) => `Critério ${id}`),
    'Critérios Pendentes',
  ].join(',')

  const rows = breakdown.patients.map((p) =>
    [
      `"${p.name.replace(/"/g, '""')}"`,
      p.age ?? '',
      p.microarea,
      p.score.toFixed(1),
      p.classification,
      ...CRITERIA_IDS.map((id) => (p.criteria[id] ? 'Sim' : 'Não')),
      p.pendingCriteria.join(';'),
    ].join(','),
  )

  return [header, ...rows].join('\n')
}
