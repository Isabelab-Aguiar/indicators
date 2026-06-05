import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { esfs } from './esfs'
import { profiles, userRoleEnum } from './profiles'

export const accessRequestStatusEnum = pgEnum('access_request_status', [
  'pending',
  'approved',
  'rejected',
])

export const accessRequests = pgTable('access_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  cpf: text('cpf').notNull(),
  role: userRoleEnum('role').notNull(),
  esfId: uuid('esf_id').references(() => esfs.id),
  esfName: text('esf_name'),
  cnes: text('cnes'),
  ine: text('ine'),
  status: accessRequestStatusEnum('status').notNull().default('pending'),
  message: text('message'),
  reviewedBy: uuid('reviewed_by').references(() => profiles.id),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const accessRequestsRelations = relations(accessRequests, ({ one }) => ({
  esf: one(esfs, { fields: [accessRequests.esfId], references: [esfs.id] }),
  reviewer: one(profiles, { fields: [accessRequests.reviewedBy], references: [profiles.id] }),
}))

export type AccessRequestRecord = typeof accessRequests.$inferSelect
export type NewAccessRequestRecord = typeof accessRequests.$inferInsert
export type AccessRequestStatus = 'pending' | 'approved' | 'rejected'
