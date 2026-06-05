import type { C6PatientRow } from '@repo/types'
import { C6_CRITERIA_DEF } from '@/hooks/use-c6-analytics'
import type { CriterionResult, PatientDetailSection } from './patient-detail-modal'

export function buildC6Criteria(patient: C6PatientRow): CriterionResult[] {
  return C6_CRITERIA_DEF.map((def) => ({
    id: def.id,
    label: def.label,
    achieved: patient.criteria[def.id],
  }))
}

export function buildC6Sections(patient: C6PatientRow): PatientDetailSection[] {
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
