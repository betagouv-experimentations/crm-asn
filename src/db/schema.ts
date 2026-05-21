import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  date,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  administration: text("administration").notNull(),
  role: text("role"),
  email: text("email"),
  phone: text("phone"),
  context: text("context"),
  lastViewedAt: timestamp("last_viewed_at", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const contactsRelations = relations(contacts, ({ many }) => ({
  interactions: many(interactions),
  followUps: many(followUps),
}));

export const interactions = pgTable("interactions", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id")
    .notNull()
    .references(() => contacts.id, { onDelete: "cascade" }),
  date: timestamp("date", { withTimezone: true }).notNull(),
  type: text("type").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const interactionsRelations = relations(interactions, ({ one, many }) => ({
  contact: one(contacts, {
    fields: [interactions.contactId],
    references: [contacts.id],
  }),
  followUps: many(followUps),
}));

export const followUps = pgTable("follow_ups", {
  id: serial("id").primaryKey(),
  interactionId: integer("interaction_id")
    .notNull()
    .references(() => interactions.id, { onDelete: "cascade" }),
  contactId: integer("contact_id")
    .notNull()
    .references(() => contacts.id, { onDelete: "cascade" }),
  dueDate: date("due_date").notNull(),
  label: text("label").notNull(),
  done: boolean("done").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const followUpsRelations = relations(followUps, ({ one }) => ({
  interaction: one(interactions, {
    fields: [followUps.interactionId],
    references: [interactions.id],
  }),
  contact: one(contacts, {
    fields: [followUps.contactId],
    references: [contacts.id],
  }),
}));

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type Interaction = typeof interactions.$inferSelect;
export type NewInteraction = typeof interactions.$inferInsert;
export type FollowUp = typeof followUps.$inferSelect;
export type NewFollowUp = typeof followUps.$inferInsert;
