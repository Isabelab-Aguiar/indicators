import type { C4PatientRow } from '@repo/types'
import { C4_CRITERIA_DEF } from '@/hooks/use-c4-analytics'
import type { CriterionResult, PatientDetailSection } from './patient-detail-modal'

export function buildC4Criteria(patient: C4PatientRow): CriterionResult[] {
  return C4_CRITERIA_DEF.map((def) => ({
    id: def.id,
    label: def.label,
    achieved: patient.criteria[def.id],
  }))
}

export function buildC4Sections(patient: C4PatientRow): PatientDetailSection[] {
  return [
    {
      title: 'Dados do paciente',
      fields: [
        { label: 'Microárea', value: patient.microarea },
        { label: 'ACS responsável', value: patient.acs },
        { label: 'Pontuação no indicador', value: `${patient.score}%` },
      ],
    },
  ]
}
