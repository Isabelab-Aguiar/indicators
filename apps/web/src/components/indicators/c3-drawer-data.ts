import type { C3PatientRow } from '@repo/types'
import { C3_CRITERIA_DEF } from '@/hooks/use-c3-analytics'
import type { CriterionResult, PatientDetailSection } from './patient-detail-modal'

function examLabel(v: string): string {
  if (v === 'negative' || v === 'positive') return 'Realizado'
  if (v === 'not_performed') return 'Não realizado'
  if (v === 'pending') return 'Pendente'
  return '—'
}

export function buildC3Criteria(patient: C3PatientRow): CriterionResult[] {
  return C3_CRITERIA_DEF.map((def) => ({
    id: def.id,
    label: def.label,
    achieved: patient.criteriaMet.includes(def.id),
  }))
}

export function buildC3Sections(patient: C3PatientRow): PatientDetailSection[] {
  return [
    {
      title: 'Consultas e acompanhamento',
      fields: [
        { label: 'Consultas pré-natal', value: patient.prenatalConsultations },
        { label: '1ª consulta até 12ª semana', value: patient.consultationsUpTo12Weeks },
        { label: 'Aferições de PA', value: patient.bloodPressureMeasurements },
        { label: 'Registros peso/altura', value: patient.weightHeightMeasurements },
        { label: 'Visitas domiciliares', value: patient.homeVisits },
        { label: 'Atendimentos odontológicos', value: patient.dentalAppointments },
        { label: 'Vacina dTpa', value: patient.dtpaRegistered, format: 'boolean' as const },
      ],
    },
    {
      title: 'Exames 1º trimestre',
      fields: [
        { label: 'HIV', value: examLabel(patient.hivExam1stTrimester) },
        { label: 'Sífilis', value: examLabel(patient.syphilisExam1stTrimester) },
        { label: 'Hepatite B', value: examLabel(patient.hepatitisBExam1stTrimester) },
        { label: 'Hepatite C', value: examLabel(patient.hepatitisCExam1stTrimester) },
      ],
    },
    {
      title: 'Exames 3º trimestre',
      fields: [
        { label: 'HIV', value: examLabel(patient.hivExam3rdTrimester) },
        { label: 'Sífilis', value: examLabel(patient.syphilisExam3rdTrimester) },
      ],
    },
  ]
}
