import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Don't forget to export all your tables, needed for drizzle!
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  body: text("body").notNull(),
});

// Not necessarily needed, but it's handy to be able to use `schema.messages` instead of `messages` to avoid naming conflicts
export const schema = {
  messages,
};
