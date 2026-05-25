import {
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { esfs } from './esfs'

export const c1ImportacaoStatusEnum = pgEnum('c1_importacao_status', [
  'pendente',
  'processando',
  'concluido',
  'erro',
])

export const c1ClassificacaoEnum = pgEnum('c1_classificacao', [
  'otimo',
  'bom',
  'suficiente',
  'regular',
])

export const c1Importacoes = pgTable(
  'c1_importacoes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    esfId: uuid('esf_id')
      .notNull()
      .references(() => esfs.id),
    periodo: text('periodo').notNull(),
    arquivoNome: text('arquivo_nome').notNull(),
    arquivoUrl: text('arquivo_url').notNull(),
    status: c1ImportacaoStatusEnum('status').notNull().default('pendente'),
    erroDetalhes: text('erro_detalhes'),
    criadoEm: timestamp('criado_em', { withTimezone: true }).defaultNow().notNull(),
    atualizadoEm: timestamp('atualizado_em', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    esfPeriodoIdx: index('idx_c1_importacoes_esf_periodo').on(t.esfId, t.periodo),
  }),
)

export const c1Execucoes = pgTable(
  'c1_execucoes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    importacaoId: uuid('importacao_id')
      .notNull()
      .references(() => c1Importacoes.id),
    esfId: uuid('esf_id')
      .notNull()
      .references(() => esfs.id),
    periodo: text('periodo').notNull(),
    programada: integer('programada').notNull(),
    espontanea: integer('espontanea').notNull(),
    total: integer('total').notNull(),
    percentual: numeric('percentual', { precision: 5, scale: 2 }).notNull(),
    classificacao: c1ClassificacaoEnum('classificacao').notNull(),
    alerta: text('alerta'),
    breakdownJson: jsonb('breakdown_json'),
    criadoEm: timestamp('criado_em', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    esfPeriodoIdx: index('idx_c1_execucoes_esf_periodo').on(t.esfId, t.periodo),
    classificacaoIdx: index('idx_c1_execucoes_classificacao').on(t.classificacao),
  }),
)

export const c1AnalyticsSnapshots = pgTable('c1_analytics_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  esfId: uuid('esf_id')
    .notNull()
    .references(() => esfs.id),
  periodo: text('periodo').notNull(),
  snapshotJson: jsonb('snapshot_json').notNull(),
  criadoEm: timestamp('criado_em', { withTimezone: true }).defaultNow().notNull(),
})

export const c1ImportacoesRelations = relations(c1Importacoes, ({ one, many }) => ({
  esf: one(esfs, { fields: [c1Importacoes.esfId], references: [esfs.id] }),
  execucoes: many(c1Execucoes),
}))

export const c1ExecucoesRelations = relations(c1Execucoes, ({ one }) => ({
  importacao: one(c1Importacoes, {
    fields: [c1Execucoes.importacaoId],
    references: [c1Importacoes.id],
  }),
  esf: one(esfs, { fields: [c1Execucoes.esfId], references: [esfs.id] }),
}))

export type C1Importacao = typeof c1Importacoes.$inferSelect
export type NewC1Importacao = typeof c1Importacoes.$inferInsert
export type C1Execucao = typeof c1Execucoes.$inferSelect
export type NewC1Execucao = typeof c1Execucoes.$inferInsert
export type C1Classificacao = 'otimo' | 'bom' | 'suficiente' | 'regular'
export type C1ImportacaoStatus = 'pendente' | 'processando' | 'concluido' | 'erro'
