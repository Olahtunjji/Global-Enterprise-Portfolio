import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  serviceRequestId: integer("service_request_id").notNull(),
  direction: text("direction").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  recipientEmail: text("recipient_email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Message = typeof messagesTable.$inferSelect;
