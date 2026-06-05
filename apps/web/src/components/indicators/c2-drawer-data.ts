import type { C2PatientRow } from '@repo/types'
import { C2_CRITERIA_DEF } from '@/hooks/use-c2-analytics'
import type { CriterionResult, PatientDetailSection } from './patient-detail-modal'

export function buildC2Criteria(patient: C2PatientRow): CriterionResult[] {
  return C2_CRITERIA_DEF.map((def) => ({
    id: def.id,
    label: def.label,
    achieved: patient.criteria[def.id as keyof typeof patient.criteria],
    notApplicable: patient.notApplicableCriteria.includes(def.id as keyof typeof patient.criteria),
  }))
}

export function buildC2Sections(patient: C2PatientRow): PatientDetailSection[] {
  const age =
    patient.ageInDays !== null
      ? patient.ageInDays < 30
        ? `${patient.ageInDays} dias`
        : patient.ageInDays < 365
          ? `${Math.floor(patient.ageInDays / 30)} meses`
          : `${Math.floor(patient.ageInDays / 365)} ano(s) e ${Math.floor((patient.ageInDays % 365) / 30)} meses`
      : '—'

  return [
    {
      title: 'Dados da criança',
      fields: [
        { label: 'Microárea', value: patient.microarea },
        { label: 'ACS responsável', value: patient.acs },
        { label: 'Idade', value: age },
        { label: 'Pontuação no indicador', value: `${patient.score}%` },
      ],
    },
  ]
}
