import {
  boolean,
  date,
  index,
  numeric,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { esfs } from './esfs'

export const c7Scores = pgTable(
  'c7_scores',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    esfId: uuid('esf_id')
      .notNull()
      .references(() => esfs.id),
    nome: varchar('nome', { length: 255 }).notNull(),
    birthDate: date('birth_date').notNull(),
    cytologyLast36m: boolean('cytology_last36m').notNull().default(false),
    hpvVaccineDose1: boolean('hpv_vaccine_dose1').notNull().default(false),
    sexualHealthLast12m: boolean('sexual_health_last12m').notNull().default(false),
    mammographyLast24m: boolean('mammography_last24m').notNull().default(false),
    score: numeric('score', { precision: 5, scale: 2 }),
    scoreMax: numeric('score_max', { precision: 5, scale: 2 }),
    classification: varchar('classification', { length: 20 }),
    periodo: varchar('periodo', { length: 10 }).notNull(),
    microarea: varchar('microarea', { length: 50 }).notNull().default(''),
    acs: varchar('acs', { length: 100 }).notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    esfPeriodoIdx: index('idx_c7_esf_periodo').on(t.esfId, t.periodo),
    uniqueNomePeriodo: unique('uq_c7_nome_periodo').on(t.esfId, t.nome, t.periodo),
  }),
)

export const c7ScoresRelations = relations(c7Scores, ({ one }) => ({
  esf: one(esfs, { fields: [c7Scores.esfId], references: [esfs.id] }),
}))

export type C7Score = typeof c7Scores.$inferSelect
export type NewC7Score = typeof c7Scores.$inferInsert
