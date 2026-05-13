import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const esfs = pgTable('esfs', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type EsfRecord = typeof esfs.$inferSelect
export type NewEsfRecord = typeof esfs.$inferInsert
