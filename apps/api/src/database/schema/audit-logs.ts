import { jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { esfs } from './esfs'
import { profiles } from './profiles'

export const auditActionEnum = pgEnum('audit_action', [
  'CREATE',
  'UPDATE',
  'DELETE',
  'LOGIN',
  'LOGOUT',
  'IMPORT',
  'EXPORT',
  'PASSWORD_RESET',
  'INVITE_SENT',
  'ACCESS_REQUEST_APPROVED',
  'ACCESS_REQUEST_REJECTED',
])

export const auditEntityEnum = pgEnum('audit_entity', [
  'pregnant_women',
  'users',
  'imports',
  'auth',
  'settings',
  'access_request',
])

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profiles.id),
  esfId: uuid('esf_id').references(() => esfs.id),
  action: auditActionEnum('action').notNull(),
  entity: auditEntityEnum('entity').notNull(),
  entityId: uuid('entity_id'),
  metadata: jsonb('metadata'),
  ipAddress: text('ip_address').notNull(),
  userAgent: text('user_agent').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(profiles, { fields: [auditLogs.userId], references: [profiles.id] }),
  esf: one(esfs, { fields: [auditLogs.esfId], references: [esfs.id] }),
}))

export type AuditLogRecord = typeof auditLogs.$inferSelect
export type NewAuditLogRecord = typeof auditLogs.$inferInsert
