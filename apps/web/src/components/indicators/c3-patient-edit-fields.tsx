'use client'

import { cn } from '@repo/ui'
import type { C3PatientRow } from '@repo/types'

export type ExamResult = 'pending' | 'negative' | 'positive' | 'not_performed'

export interface EditForm {
  prenatalConsultations: number
  consultationsUpTo12Weeks: number
  bloodPressureMeasurements: number
  weightHeightMeasurements: number
  homeVisits: number
  dentalAppointments: number
  dtpaRegistered: boolean
  hivExam1stTrimester: ExamResult
  syphilisExam1stTrimester: ExamResult
  hepatitisBExam1stTrimester: ExamResult
  hepatitisCExam1stTrimester: ExamResult
  hivExam3rdTrimester: ExamResult
  syphilisExam3rdTrimester: ExamResult
}

const EXAM_OPTIONS: { value: ExamResult; label: string }[] = [
  { value: 'negative', label: 'Realizado — Negativo' },
  { value: 'positive', label: 'Realizado — Positivo' },
  { value: 'not_performed', label: 'Não realizado' },
  { value: 'pending', label: 'Não se enquadra' },
]

export function buildInitialForm(p: C3PatientRow): EditForm {
  return {
    prenatalConsultations: p.prenatalConsultations,
    consultationsUpTo12Weeks: p.consultationsUpTo12Weeks,
    bloodPressureMeasurements: p.bloodPressureMeasurements,
    weightHeightMeasurements: p.weightHeightMeasurements,
    homeVisits: p.homeVisits,
    dentalAppointments: p.dentalAppointments,
    dtpaRegistered: p.dtpaRegistered,
    hivExam1stTrimester: p.hivExam1stTrimester as ExamResult,
    syphilisExam1stTrimester: p.syphilisExam1stTrimester as ExamResult,
    hepatitisBExam1stTrimester: p.hepatitisBExam1stTrimester as ExamResult,
    hepatitisCExam1stTrimester: p.hepatitisCExam1stTrimester as ExamResult,
    hivExam3rdTrimester: p.hivExam3rdTrimester as ExamResult,
    syphilisExam3rdTrimester: p.syphilisExam3rdTrimester as ExamResult,
  }
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground mb-2 text-[11px] font-semibold uppercase tracking-wide">
      {children}
    </p>
  )
}

function ExamSelect({
  label,
  value,
  onChange,
}: {
  label: string
  value: ExamResult
  onChange: (v: ExamResult) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground min-w-0 shrink text-xs">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ExamResult)}
        className="border-border bg-muted/50 text-foreground focus:ring-ring rounded-lg border px-2 py-1 text-xs outline-none focus:ring-1"
      >
        {EXAM_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground min-w-0 shrink text-xs">{label}</span>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Math.max(min, parseInt(e.target.value) || 0))}
        className="border-border bg-muted/50 text-foreground focus:ring-ring w-20 rounded-lg border px-2 py-1 text-right text-xs tabular-nums outline-none focus:ring-1"
      />
    </div>
  )
}

const CONSULT_FIELDS: { label: string; key: keyof EditForm }[] = [
  { label: 'Consultas pré-natal', key: 'prenatalConsultations' },
  { label: '1ª consulta até 12ª semana', key: 'consultationsUpTo12Weeks' },
  { label: 'Aferições de PA', key: 'bloodPressureMeasurements' },
  { label: 'Registros peso/altura', key: 'weightHeightMeasurements' },
  { label: 'Visitas domiciliares', key: 'homeVisits' },
  { label: 'Atendimentos odontológicos', key: 'dentalAppointments' },
]

const EXAMS_1ST: { label: string; key: keyof EditForm }[] = [
  { label: 'HIV', key: 'hivExam1stTrimester' },
  { label: 'Sífilis', key: 'syphilisExam1stTrimester' },
  { label: 'Hepatite B', key: 'hepatitisBExam1stTrimester' },
  { label: 'Hepatite C', key: 'hepatitisCExam1stTrimester' },
]

const EXAMS_3RD: { label: string; key: keyof EditForm }[] = [
  { label: 'HIV', key: 'hivExam3rdTrimester' },
  { label: 'Sífilis', key: 'syphilisExam3rdTrimester' },
]

interface EditFormFieldsProps {
  form: EditForm
  set: <K extends keyof EditForm>(key: K, value: EditForm[K]) => void
}

export function EditFormFields({ form, set }: EditFormFieldsProps) {
  return (
    <div className="space-y-5 p-5">
      <div>
        <SectionTitle>Consultas e acompanhamento</SectionTitle>
        <div className="border-border divide-border divide-y rounded-lg border">
          {CONSULT_FIELDS.map(({ label, key }) => (
            <div key={key} className="px-3 py-2">
              <NumberField
                label={label}
                value={form[key] as number}
                onChange={(v) => set(key, v as EditForm[typeof key])}
              />
            </div>
          ))}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-muted-foreground text-xs">Vacina dTpa</span>
            <button
              type="button"
              onClick={() => set('dtpaRegistered', !form.dtpaRegistered)}
              className={cn(
                'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                form.dtpaRegistered ? 'bg-emerald-500' : 'bg-muted-foreground/30',
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transition-transform',
                  form.dtpaRegistered ? 'translate-x-4' : 'translate-x-0',
                )}
              />
            </button>
          </div>
        </div>
      </div>
      <div>
        <SectionTitle>Exames 1º trimestre</SectionTitle>
        <div className="border-border divide-border divide-y rounded-lg border">
          {EXAMS_1ST.map(({ label, key }) => (
            <div key={key} className="px-3 py-2">
              <ExamSelect
                label={label}
                value={form[key] as ExamResult}
                onChange={(v) => set(key, v as EditForm[typeof key])}
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <SectionTitle>Exames 3º trimestre</SectionTitle>
        <div className="border-border divide-border divide-y rounded-lg border">
          {EXAMS_3RD.map(({ label, key }) => (
            <div key={key} className="px-3 py-2">
              <ExamSelect
                label={label}
                value={form[key] as ExamResult}
                onChange={(v) => set(key, v as EditForm[typeof key])}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
