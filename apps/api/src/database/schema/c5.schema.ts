import {
  boolean,
  date,
  index,
  integer,
  numeric,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { esfs } from './esfs'

export const c5Scores = pgTable(
  'c5_scores',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    esfId: uuid('esf_id')
      .notNull()
      .references(() => esfs.id),
    nome: varchar('nome', { length: 255 }).notNull(),
    birthDate: date('birth_date'),
    consultationsLast6m: integer('consultations_last6m').notNull().default(0),
    bloodPressureLast6m: integer('blood_pressure_last6m').notNull().default(0),
    weightHeightLast12m: boolean('weight_height_last12m').notNull().default(false),
    acsVisitsLast12m: integer('acs_visits_last12m').notNull().default(0),
    acsVisitsIntervalDays: integer('acs_visits_interval_days').notNull().default(0),
    score: numeric('score', { precision: 5, scale: 2 }),
    classification: varchar('classification', { length: 20 }),
    periodo: varchar('periodo', { length: 10 }).notNull(),
    microarea: varchar('microarea', { length: 50 }).notNull().default(''),
    acs: varchar('acs', { length: 100 }).notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    esfPeriodoIdx: index('idx_c5_esf_periodo').on(t.esfId, t.periodo),
    uniqueNomePeriodo: unique('uq_c5_nome_periodo').on(t.esfId, t.nome, t.periodo),
  }),
)

export const c5ScoresRelations = relations(c5Scores, ({ one }) => ({
  esf: one(esfs, { fields: [c5Scores.esfId], references: [esfs.id] }),
}))

export type C5Score = typeof c5Scores.$inferSelect
export type NewC5Score = typeof c5Scores.$inferInsert
