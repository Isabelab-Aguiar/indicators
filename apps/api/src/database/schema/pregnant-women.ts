import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { esfs } from './esfs'
import { profiles } from './profiles'

export const bloodPressureStatusEnum = pgEnum('blood_pressure_status', [
  'normal',
  'elevated',
  'high',
  'critical',
])

export const examResultEnum = pgEnum('exam_result', [
  'pending',
  'negative',
  'positive',
  'not_performed',
])

export const gestationalRiskEnum = pgEnum('gestational_risk', ['habitual', 'alto_risco'])

export const pregnantWomen = pgTable('pregnant_women', {
  id: uuid('id').primaryKey().defaultRandom(),
  esfId: uuid('esf_id')
    .notNull()
    .references(() => esfs.id),
  name: text('name').notNull(),
  cpf: text('cpf').notNull(),
  birthDate: timestamp('birth_date', { withTimezone: true }).notNull(),
  address: text('address').notNull(),
  phone: text('phone').notNull(),
  microarea: text('microarea').notNull(),
  weight: numeric('weight', { precision: 5, scale: 2 }),
  height: numeric('height', { precision: 5, scale: 2 }),
  bloodPressure: text('blood_pressure'),
  bloodPressureStatus: bloodPressureStatusEnum('blood_pressure_status'),
  lastMeasurementDate: timestamp('last_measurement_date', { withTimezone: true }),
  daysSinceDoctor: integer('days_since_doctor'),
  daysSinceNursing: integer('days_since_nursing'),
  daysSinceDentist: integer('days_since_dentist'),
  daysSinceHomeVisit: integer('days_since_home_visit'),
  // Dados pré-natal
  gestationalRisk: gestationalRiskEnum('gestational_risk'),
  lmp: timestamp('lmp', { withTimezone: true }),
  gestationalAgeWeeks: integer('gestational_age_weeks'),
  gestationalAgeDays: integer('gestational_age_days'),
  expectedDeliveryDate: timestamp('expected_delivery_date', { withTimezone: true }),
  gestationalAgeEcoWeeks: integer('gestational_age_eco_weeks'),
  gestationalAgeEcoDays: integer('gestational_age_eco_days'),
  expectedDeliveryDateEco: timestamp('expected_delivery_date_eco', { withTimezone: true }),
  lastPrenatalConsultation: timestamp('last_prenatal_consultation', { withTimezone: true }),
  // Contadores
  prenatalConsultations: integer('prenatal_consultations').notNull().default(0),
  consultationsUpTo12Weeks: integer('consultations_up_to_12_weeks').notNull().default(0),
  bloodPressureMeasurements: integer('blood_pressure_measurements').notNull().default(0),
  weightHeightMeasurements: integer('weight_height_measurements').notNull().default(0),
  homeVisits: integer('home_visits').notNull().default(0),
  dentalAppointments: integer('dental_appointments').notNull().default(0),
  dtpaRegistered: boolean('dtpa_registered').notNull().default(false),
  hivExam1stTrimester: examResultEnum('hiv_exam_1st_trimester').notNull().default('not_performed'),
  syphilisExam1stTrimester: examResultEnum('syphilis_exam_1st_trimester')
    .notNull()
    .default('not_performed'),
  hepatitisBExam1stTrimester: examResultEnum('hepatitis_b_exam_1st_trimester')
    .notNull()
    .default('not_performed'),
  hepatitisCExam1stTrimester: examResultEnum('hepatitis_c_exam_1st_trimester')
    .notNull()
    .default('not_performed'),
  hivExam3rdTrimester: examResultEnum('hiv_exam_3rd_trimester').notNull().default('not_performed'),
  syphilisExam3rdTrimester: examResultEnum('syphilis_exam_3rd_trimester')
    .notNull()
    .default('not_performed'),
  observations: text('observations'),
  updatedBy: uuid('updated_by').references(() => profiles.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const pregnantWomenRelations = relations(pregnantWomen, ({ one }) => ({
  esf: one(esfs, { fields: [pregnantWomen.esfId], references: [esfs.id] }),
  updatedByProfile: one(profiles, { fields: [pregnantWomen.updatedBy], references: [profiles.id] }),
}))

export type PregnantWomanRecord = typeof pregnantWomen.$inferSelect
export type NewPregnantWomanRecord = typeof pregnantWomen.$inferInsert
