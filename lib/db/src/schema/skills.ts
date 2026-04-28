import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const skillsTable = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  valueProposition: text("value_proposition").notNull(),
  logoUrl: text("logo_url").notNull().default(""),
  accentColor: text("accent_color").notNull(),
  iconKey: text("icon_key").notNull().default("anchor"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Skill = typeof skillsTable.$inferSelect;
