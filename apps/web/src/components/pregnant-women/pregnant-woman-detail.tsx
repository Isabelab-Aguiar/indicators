'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@repo/ui'
import { usePregnantWoman } from '@/hooks/use-pregnant-women'
import { BloodPressureBadge } from './blood-pressure-badge'

const EXAM_LABEL = {
  pending: 'Pendente',
  negative: 'Negativo',
  positive: 'Positivo',
  not_performed: 'Não Realizado',
} as const

const EXAM_VARIANT = {
  pending: 'secondary',
  negative: 'success',
  positive: 'destructive',
  not_performed: 'outline',
} as const

interface Props {
  id: string
}

export function PregnantWomanDetail({ id }: Props) {
  const { data, isLoading } = usePregnantWoman(id)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-muted h-40 animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground text-sm">Gestante não encontrada</p>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{data.name}</span>
            <BloodPressureBadge value={data.bloodPressure} status={data.bloodPressureStatus} />
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { label: 'CPF', value: data.cpf },
            { label: 'Nascimento', value: new Date(data.birthDate).toLocaleDateString('pt-BR') },
            { label: 'Telefone', value: data.phone },
            { label: 'Microárea', value: data.microarea },
            { label: 'Endereço', value: data.address },
            { label: 'Peso', value: data.weight ? `${data.weight} kg` : '—' },
            { label: 'Altura', value: data.height ? `${data.height} cm` : '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-muted-foreground text-xs">{label}</p>
              <p className="text-foreground text-sm font-medium">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Indicadores de Acompanhamento</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: 'Consultas Pré-Natal', value: data.prenatalConsultations },
            { label: 'Até 12 semanas', value: data.consultationsUpTo12Weeks },
            { label: 'Medições PA', value: data.bloodPressureMeasurements },
            { label: 'Medições Peso/Alt.', value: data.weightHeightMeasurements },
            { label: 'Visitas Dom.', value: data.homeVisits },
            { label: 'Atend. Odonto', value: data.dentalAppointments },
          ].map(({ label, value }) => (
            <div key={label} className="border-border rounded-lg border p-3 text-center">
              <p className="text-foreground text-2xl font-bold">{value}</p>
              <p className="text-muted-foreground mt-0.5 text-[10px]">{label}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Exames Laboratoriais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: 'HIV 1º Trim.', value: data.hivExam1stTrimester },
            { label: 'Sífilis 1º Trim.', value: data.syphilisExam1stTrimester },
            { label: 'Hep. B 1º Trim.', value: data.hepatitisBExam1stTrimester },
            { label: 'Hep. C 1º Trim.', value: data.hepatitisCExam1stTrimester },
            { label: 'HIV 3º Trim.', value: data.hivExam3rdTrimester },
            { label: 'Sífilis 3º Trim.', value: data.syphilisExam3rdTrimester },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="border-border flex items-center justify-between rounded-lg border px-3 py-2"
            >
              <span className="text-muted-foreground text-xs">{label}</span>
              <Badge
                variant={EXAM_VARIANT[value] as 'secondary' | 'success' | 'destructive' | 'outline'}
              >
                {EXAM_LABEL[value]}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
