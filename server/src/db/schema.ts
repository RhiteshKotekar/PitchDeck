import {
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ─── Users ───────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").unique().notNull(),
  displayName: text("display_name").notNull(),
  username: text("username").unique(),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ─── Ideas ───────────────────────────────────────────────────────────
export const ideas = pgTable("ideas", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  authorId: integer("author_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  aiScore: integer("ai_score"),
  marketPotentialScore: integer("market_potential_score"),
  innovationScore: integer("innovation_score"),
  feasibilityScore: integer("feasibility_score"),
  aiFeedback: jsonb("ai_feedback"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ─── Votes ───────────────────────────────────────────────────────────
export const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    ideaId: uuid("idea_id")
      .references(() => ideas.id, { onDelete: "cascade" })
      .notNull(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [unique("votes_idea_user_unique").on(t.ideaId, t.userId)]
);

// ─── Relations ───────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  ideas: many(ideas),
  votes: many(votes),
}));

export const ideasRelations = relations(ideas, ({ one, many }) => ({
  author: one(users, { fields: [ideas.authorId], references: [users.id] }),
  votes: many(votes),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  idea: one(ideas, { fields: [votes.ideaId], references: [ideas.id] }),
  user: one(users, { fields: [votes.userId], references: [users.id] }),
}));

// ─── Type helpers ────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Idea = typeof ideas.$inferSelect;
export type NewIdea = typeof ideas.$inferInsert;
export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;
