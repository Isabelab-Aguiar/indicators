import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { esfs } from './esfs'
import { profiles } from './profiles'
import { userRoleEnum } from './profiles'

export const inviteTokens = pgTable('invite_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: userRoleEnum('role').notNull(),
  esfId: uuid('esf_id')
    .notNull()
    .references(() => esfs.id),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdBy: uuid('created_by')
    .notNull()
    .references(() => profiles.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const inviteTokensRelations = relations(inviteTokens, ({ one }) => ({
  esf: one(esfs, { fields: [inviteTokens.esfId], references: [esfs.id] }),
  creator: one(profiles, { fields: [inviteTokens.createdBy], references: [profiles.id] }),
}))

export type InviteTokenRecord = typeof inviteTokens.$inferSelect
export type NewInviteTokenRecord = typeof inviteTokens.$inferInsert
