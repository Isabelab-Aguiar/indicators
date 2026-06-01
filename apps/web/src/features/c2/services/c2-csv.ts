import type { C2Breakdown } from '@repo/types'
import { C2_CRITERIA_DEF } from '@/hooks/use-c2-analytics'

const CRITERIA_IDS = C2_CRITERIA_DEF.map((c) => c.id)

export function gerarCsvC2(breakdown: C2Breakdown): string {
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
      ...CRITERIA_IDS.map((id) => (p.criteria[id as keyof typeof p.criteria] ? 'Sim' : 'Não')),
      p.pendingCriteria.join(';'),
    ].join(','),
  )

  return [header, ...rows].join('\n')
}
