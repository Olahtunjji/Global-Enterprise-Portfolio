import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const servicesTable = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  deliverables: text("deliverables").array().notNull().default([]),
  portfolioHighlights: text("portfolio_highlights")
    .array()
    .notNull()
    .default([]),
  contractTerms: text("contract_terms").notNull(),
  iconKey: text("icon_key").notNull().default("anchor"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Service = typeof servicesTable.$inferSelect;
