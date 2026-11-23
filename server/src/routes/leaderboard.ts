import { Hono } from "hono";
import { sql, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { ideas, users, votes } from "../db/schema.js";

const app = new Hono();

// ─── GET /api/leaderboard ────────────────────────────────────────────
app.get("/", async (c) => {
  const period = c.req.query("period") || "all"; // "week" | "all"
  const mode = c.req.query("mode") || "most_voted"; // "most_voted" | "highest_rated"

  // Period filter for votes
  let periodFilter = sql`TRUE`;
  if (period === "week") {
    periodFilter = sql`${votes.createdAt} >= NOW() - INTERVAL '7 days'`;
  }

  if (mode === "most_voted") {
    // Top ideas by vote count
    const rows = await db
      .select({
        id: ideas.id,
        name: ideas.name,
        tagline: ideas.tagline,
        category: ideas.category,
        aiScore: ideas.aiScore,
        authorDisplayName: users.displayName,
        authorUsername: users.username,
        authorAvatarUrl: users.avatarUrl,
        voteCount: sql<number>`(
          SELECT count(*) FROM votes
          WHERE votes.idea_id = ${ideas.id}
          AND ${periodFilter}
        )::int`.as("vote_count"),
      })
      .from(ideas)
      .innerJoin(users, sql`${ideas.authorId} = ${users.id}`)
      .orderBy(sql`vote_count DESC`)
      .limit(10);

    const ranked = rows.map((row, i) => ({
      rank: i + 1,
      idea: {
        id: row.id,
        name: row.name,
        tagline: row.tagline,
        category: row.category,
        aiScore: row.aiScore ?? 0,
        voteCount: row.voteCount ?? 0,
        author: {
          displayName: row.authorDisplayName,
          username: row.authorUsername,
          avatarUrl: row.authorAvatarUrl,
        },
      },
    }));

    return c.json({ data: ranked, period, mode });
  }

  // mode === "highest_rated"
  let ratedQuery;
  if (period === "week") {
    ratedQuery = await db
      .select({
        id: ideas.id,
        name: ideas.name,
        tagline: ideas.tagline,
        category: ideas.category,
        aiScore: ideas.aiScore,
        authorDisplayName: users.displayName,
        authorUsername: users.username,
        authorAvatarUrl: users.avatarUrl,
        voteCount: sql<number>`(SELECT count(*) FROM votes WHERE votes.idea_id = ${ideas.id})::int`,
      })
      .from(ideas)
      .innerJoin(users, sql`${ideas.authorId} = ${users.id}`)
      .where(sql`${ideas.createdAt} >= NOW() - INTERVAL '7 days'`)
      .orderBy(desc(ideas.aiScore))
      .limit(10);
  } else {
    ratedQuery = await db
      .select({
        id: ideas.id,
        name: ideas.name,
        tagline: ideas.tagline,
        category: ideas.category,
        aiScore: ideas.aiScore,
        authorDisplayName: users.displayName,
        authorUsername: users.username,
        authorAvatarUrl: users.avatarUrl,
        voteCount: sql<number>`(SELECT count(*) FROM votes WHERE votes.idea_id = ${ideas.id})::int`,
      })
      .from(ideas)
      .innerJoin(users, sql`${ideas.authorId} = ${users.id}`)
      .orderBy(desc(ideas.aiScore))
      .limit(10);
  }

  const ranked = ratedQuery.map((row, i) => ({
    rank: i + 1,
    idea: {
      id: row.id,
      name: row.name,
      tagline: row.tagline,
      category: row.category,
      aiScore: row.aiScore ?? 0,
      voteCount: row.voteCount ?? 0,
      author: {
        displayName: row.authorDisplayName,
        username: row.authorUsername,
        avatarUrl: row.authorAvatarUrl,
      },
    },
  }));

  return c.json({ data: ranked, period, mode });
});

export default app;
