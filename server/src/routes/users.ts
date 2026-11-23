import { Hono } from "hono";
import { eq, sql, count } from "drizzle-orm";
import { db } from "../db/index.js";
import { users, ideas, votes } from "../db/schema.js";
import { clerkAuth, ensureUser } from "../middleware/auth.js";

const app = new Hono();

// All user routes require auth
app.use("/*", clerkAuth, ensureUser);

// ─── GET /api/me ─────────────────────────────────────────────────────
app.get("/me", async (c) => {
  const userId = c.get("userId");

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({ data: user });
});

// ─── PATCH /api/me ───────────────────────────────────────────────────
app.patch("/me", async (c) => {
  const userId = c.get("userId");

  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const allowedFields = ["displayName", "username", "email", "avatarUrl", "bio"];
  const updates: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (field in body) {
      // Map camelCase to snake_case column names
      const columnMap: Record<string, string> = {
        displayName: "display_name",
        username: "username",
        email: "email",
        avatarUrl: "avatar_url",
        bio: "bio",
      };
      updates[columnMap[field]] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return c.json({ error: "No valid fields to update" }, 400);
  }

  updates["updated_at"] = new Date();

  try {
    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();

    return c.json({ data: updated });
  } catch (err: any) {
    if (err.message?.includes("unique") || err.code === "23505") {
      return c.json({ error: "Username or email already taken" }, 409);
    }
    throw err;
  }
});

// ─── GET /api/users/me/ideas ─────────────────────────────────────────
app.get("/me/ideas", async (c) => {
  const userId = c.get("userId");

  const userIdeas = await db
    .select({
      id: ideas.id,
      name: ideas.name,
      tagline: ideas.tagline,
      description: ideas.description,
      category: ideas.category,
      aiScore: ideas.aiScore,
      marketPotentialScore: ideas.marketPotentialScore,
      innovationScore: ideas.innovationScore,
      feasibilityScore: ideas.feasibilityScore,
      aiFeedback: ideas.aiFeedback,
      createdAt: ideas.createdAt,
      updatedAt: ideas.updatedAt,
      voteCount: sql<number>`(SELECT count(*) FROM votes WHERE votes.idea_id = ${ideas.id})::int`,
    })
    .from(ideas)
    .where(eq(ideas.authorId, userId))
    .orderBy(sql`${ideas.createdAt} DESC`);

  return c.json({ data: userIdeas });
});

// ─── GET /api/users/me/stats ─────────────────────────────────────────
app.get("/me/stats", async (c) => {
  const userId = c.get("userId");

  // Count ideas
  const [ideasResult] = await db
    .select({ count: count() })
    .from(ideas)
    .where(eq(ideas.authorId, userId));

  // Total votes received on user's ideas
  const [votesResult] = await db
    .select({ count: count() })
    .from(votes)
    .innerJoin(ideas, eq(votes.ideaId, ideas.id))
    .where(eq(ideas.authorId, userId));

  // Average AI score
  const [avgResult] = await db
    .select({
      avg: sql<number>`COALESCE(AVG(${ideas.aiScore}), 0)::int`,
    })
    .from(ideas)
    .where(eq(ideas.authorId, userId));

  return c.json({
    data: {
      ideasCount: ideasResult.count,
      totalVotes: votesResult.count,
      averageScore: avgResult.avg,
    },
  });
});

export default app;
