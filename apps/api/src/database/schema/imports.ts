import { integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { esfs } from './esfs'
import { profiles } from './profiles'

export const importTypeEnum = pgEnum('import_type', ['csv', 'pdf'])
export const importStatusEnum = pgEnum('import_status', [
  'pending',
  'processing',
  'completed',
  'failed',
  'partial',
])

export const imports = pgTable('imports', {
  id: uuid('id').primaryKey().defaultRandom(),
  esfId: uuid('esf_id')
    .notNull()
    .references(() => esfs.id),
  type: importTypeEnum('type').notNull(),
  fileName: text('file_name').notNull(),
  totalRecords: integer('total_records').notNull().default(0),
  processedRecords: integer('processed_records').notNull().default(0),
  failedRecords: integer('failed_records').notNull().default(0),
  status: importStatusEnum('status').notNull().default('pending'),
  errorMessage: text('error_message'),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const importsRelations = relations(imports, ({ one }) => ({
  esf: one(esfs, { fields: [imports.esfId], references: [esfs.id] }),
  user: one(profiles, { fields: [imports.userId], references: [profiles.id] }),
}))

export type ImportRecord = typeof imports.$inferSelect
export type NewImportRecord = typeof imports.$inferInsert
