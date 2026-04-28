import {
  pgTable,
  serial,
  text,
  integer,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const landmarksTable = pgTable("landmarks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull().default("restaurant"),
  starRating: integer("star_rating").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  directionsHint: text("directions_hint").notNull(),
});

export type Landmark = typeof landmarksTable.$inferSelect;
