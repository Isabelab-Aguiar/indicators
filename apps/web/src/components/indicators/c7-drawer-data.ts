import type { C7PatientRow } from '@repo/types'
import { C7_CRITERIA_DEF } from '@/hooks/use-c7-analytics'
import type { CriterionResult, PatientDetailSection } from './patient-detail-modal'

export function buildC7Criteria(patient: C7PatientRow): CriterionResult[] {
  return C7_CRITERIA_DEF.filter((def) => patient.eligibility[def.id]).map((def) => ({
    id: def.id,
    label: `${def.label} · ${def.ageRange}`,
    achieved: patient.criteria[def.id],
  }))
}

export function buildC7Sections(patient: C7PatientRow): PatientDetailSection[] {
  return [
    {
      title: 'Dados da paciente',
      fields: [
        { label: 'Microárea', value: patient.microarea },
        { label: 'ACS responsável', value: patient.acs },
        { label: 'Idade', value: `${patient.age} anos` },
        { label: 'Pontuação no indicador', value: `${patient.pctScore.toFixed(0)}%` },
      ],
    },
  ]
}
