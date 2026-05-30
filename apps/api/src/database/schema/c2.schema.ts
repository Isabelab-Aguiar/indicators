import {
  boolean,
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

export const c2Scores = pgTable(
  'c2_scores',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    esfId: uuid('esf_id')
      .notNull()
      .references(() => esfs.id),
    nome: varchar('nome', { length: 255 }).notNull(),
    firstConsultUntilDay30: boolean('first_consult_until_day30').notNull().default(false),
    prenatalConsults: integer('prenatal_consults').notNull().default(0),
    weightHeightRecords: integer('weight_height_records').notNull().default(0),
    firstAcsVisitUntilDay30: boolean('first_acs_visit_until_day30').notNull().default(false),
    secondAcsVisitUntilMonth6: boolean('second_acs_visit_until_month6').notNull().default(false),
    vaccinesComplete: boolean('vaccines_complete').notNull().default(false),
    score: numeric('score', { precision: 5, scale: 2 }),
    classification: varchar('classification', { length: 20 }),
    periodo: varchar('periodo', { length: 10 }).notNull(),
    microarea: varchar('microarea', { length: 50 }).notNull().default(''),
    acs: varchar('acs', { length: 100 }).notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    esfPeriodoIdx: index('idx_c2_esf_periodo').on(t.esfId, t.periodo),
    uniqueNomePeriodo: unique('uq_c2_nome_periodo').on(t.esfId, t.nome, t.periodo),
  }),
)

export const c2ScoresRelations = relations(c2Scores, ({ one }) => ({
  esf: one(esfs, { fields: [c2Scores.esfId], references: [esfs.id] }),
}))

export type C2Score = typeof c2Scores.$inferSelect
export type NewC2Score = typeof c2Scores.$inferInsert
