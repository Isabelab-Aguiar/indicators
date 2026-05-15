import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { esfs } from './esfs'

export const userRoleEnum = pgEnum('user_role', ['admin', 'manager', 'nurse', 'doctor', 'acs'])
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'pending_first_access'])

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  cpf: text('cpf').unique(),
  email: text('email').unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull().default('acs'),
  status: userStatusEnum('status').notNull().default('pending_first_access'),
  team: text('team'),
  avatarUrl: text('avatar_url'),
  esfId: uuid('esf_id')
    .notNull()
    .references(() => esfs.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const profilesRelations = relations(profiles, ({ one }) => ({
  esf: one(esfs, { fields: [profiles.esfId], references: [esfs.id] }),
}))

export type ProfileRecord = typeof profiles.$inferSelect
export type NewProfileRecord = typeof profiles.$inferInsert
