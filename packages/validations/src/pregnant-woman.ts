import { z } from 'zod'

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/

const examResultEnum = z.enum(['pending', 'negative', 'positive', 'not_performed'])

export const pregnantWomanSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255),
  cpf: z.string().regex(cpfRegex, 'CPF inválido. Formato: 000.000.000-00'),
  birthDate: z.string().datetime({ offset: true }).or(z.string().date()),
  address: z.string().min(5, 'Endereço deve ter no mínimo 5 caracteres').max(500),
  phone: z.string().regex(phoneRegex, 'Telefone inválido. Formato: (00) 00000-0000'),
  microarea: z.string().min(1, 'Microárea é obrigatória').max(50),
  weight: z.number().positive().max(300).nullable().optional(),
  height: z.number().positive().max(250).nullable().optional(),
  bloodPressure: z.string().max(20).nullable().optional(),
  lastMeasurementDate: z.string().nullable().optional(),
  daysSinceDoctor: z.number().int().nonnegative().nullable().optional(),
  daysSinceNursing: z.number().int().nonnegative().nullable().optional(),
  daysSinceDentist: z.number().int().nonnegative().nullable().optional(),
  daysSinceHomeVisit: z.number().int().nonnegative().nullable().optional(),
  prenatalConsultations: z.number().int().nonnegative().default(0),
  consultationsUpTo12Weeks: z.number().int().nonnegative().default(0),
  bloodPressureMeasurements: z.number().int().nonnegative().default(0),
  weightHeightMeasurements: z.number().int().nonnegative().default(0),
  homeVisits: z.number().int().nonnegative().default(0),
  dentalAppointments: z.number().int().nonnegative().default(0),
  dtpaRegistered: z.boolean().default(false),
  hivExam1stTrimester: examResultEnum.default('pending'),
  syphilisExam1stTrimester: examResultEnum.default('pending'),
  hepatitisBExam1stTrimester: examResultEnum.default('pending'),
  hepatitisCExam1stTrimester: examResultEnum.default('pending'),
  hivExam3rdTrimester: examResultEnum.default('pending'),
  syphilisExam3rdTrimester: examResultEnum.default('pending'),
  observations: z.string().max(2000).nullable().optional(),
})

export const updatePregnantWomanSchema = pregnantWomanSchema.partial().extend({
  id: z.string().uuid(),
})

export const pregnantWomanFiltersSchema = z.object({
  search: z.string().optional(),
  microarea: z.string().optional(),
  bloodPressureStatus: z.enum(['normal', 'elevated', 'high', 'critical']).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export type PregnantWomanInput = z.infer<typeof pregnantWomanSchema>
export type UpdatePregnantWomanInput = z.infer<typeof updatePregnantWomanSchema>
export type PregnantWomanFiltersInput = z.infer<typeof pregnantWomanFiltersSchema>
