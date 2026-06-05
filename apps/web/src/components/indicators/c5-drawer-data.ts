import type { C5PatientRow } from '@repo/types'
import { C5_CRITERIA_DEF } from '@/hooks/use-c5-analytics'
import type { CriterionResult, PatientDetailSection } from './patient-detail-modal'

export function buildC5Criteria(patient: C5PatientRow): CriterionResult[] {
  return C5_CRITERIA_DEF.map((def) => ({
    id: def.id,
    label: def.label,
    achieved: patient.criteria[def.id],
  }))
}

export function buildC5Sections(patient: C5PatientRow): PatientDetailSection[] {
  return [
    {
      title: 'Dados do paciente',
      fields: [
        { label: 'Microárea', value: patient.microarea },
        { label: 'ACS responsável', value: patient.acs },
        ...(patient.age !== null ? [{ label: 'Idade', value: `${patient.age} anos` }] : []),
        { label: 'Pontuação no indicador', value: `${patient.score}%` },
      ],
    },
  ]
}
