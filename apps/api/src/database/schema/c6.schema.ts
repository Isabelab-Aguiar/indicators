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

export const c6Scores = pgTable(
  'c6_scores',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    esfId: uuid('esf_id')
      .notNull()
      .references(() => esfs.id),
    nome: varchar('nome', { length: 255 }).notNull(),
    birthDate: date('birth_date'),
    consultationsLast12m: integer('consultations_last12m').notNull().default(0),
    weightHeightLast12m: boolean('weight_height_last12m').notNull().default(false),
    acsVisitsLast12m: integer('acs_visits_last12m').notNull().default(0),
    acsVisitsIntervalDays: integer('acs_visits_interval_days').notNull().default(0),
    influenzaVaccineLast12m: boolean('influenza_vaccine_last12m').notNull().default(false),
    score: numeric('score', { precision: 5, scale: 2 }),
    classification: varchar('classification', { length: 20 }),
    periodo: varchar('periodo', { length: 10 }).notNull(),
    microarea: varchar('microarea', { length: 50 }).notNull().default(''),
    acs: varchar('acs', { length: 100 }).notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    esfPeriodoIdx: index('idx_c6_esf_periodo').on(t.esfId, t.periodo),
    uniqueNomePeriodo: unique('uq_c6_nome_periodo').on(t.esfId, t.nome, t.periodo),
  }),
)

export const c6ScoresRelations = relations(c6Scores, ({ one }) => ({
  esf: one(esfs, { fields: [c6Scores.esfId], references: [esfs.id] }),
}))

export type C6Score = typeof c6Scores.$inferSelect
export type NewC6Score = typeof c6Scores.$inferInsert
