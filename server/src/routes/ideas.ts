import { Hono } from "hono";
import {
  eq,
  sql,
  desc,
  asc,
  and,
  ilike,
  count,
  or,
} from "drizzle-orm";
import { db } from "../db/index.js";
import { ideas, users, votes } from "../db/schema.js";
import { clerkAuth, ensureUser } from "../middleware/auth.js";
import { evaluateIdea } from "../services/evaluation.js";

const app = new Hono();

// ─── GET /api/ideas ──────────────────────────────────────────────────
// Public read — auth is optional (for hasVoted)
app.get("/", async (c) => {
  const page = Math.max(1, parseInt(c.req.query("page") || "1", 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(c.req.query("pageSize") || "10", 10)));
  const sort = c.req.query("sort") || "newest";
  const category = c.req.query("category");
  const search = c.req.query("search");

  const offset = (page - 1) * pageSize;

  // Build where conditions
  const conditions = [];
  if (category) {
    conditions.push(eq(ideas.category, category));
  }
  if (search) {
    conditions.push(
      or(
        ilike(ideas.name, `%${search}%`),
        ilike(ideas.tagline, `%${search}%`),
        ilike(ideas.description, `%${search}%`)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Count total
  const [totalResult] = await db
    .select({ count: count() })
    .from(ideas)
    .where(whereClause);
  const total = totalResult.count;

  // Sort clause
  let orderClause;
  switch (sort) {
    case "highest_rated":
      orderClause = desc(ideas.aiScore);
      break;
    case "most_voted":
      orderClause = sql`vote_count DESC`;
      break;
    case "trending":
      // Trending = recent + high votes (weighted)
      orderClause = sql`(vote_count * 2 + ${ideas.aiScore}) DESC`;
      break;
    case "oldest":
      orderClause = asc(ideas.createdAt);
      break;
    case "newest":
    default:
      orderClause = desc(ideas.createdAt);
      break;
  }

  const rows = await db
    .select({
      id: ideas.id,
      authorId: ideas.authorId,
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
      voteCount: sql<number>`(SELECT count(*) FROM votes WHERE votes.idea_id = ${ideas.id})::int`.as("vote_count"),
      authorDisplayName: users.displayName,
      authorUsername: users.username,
      authorAvatarUrl: users.avatarUrl,
    })
    .from(ideas)
    .innerJoin(users, eq(ideas.authorId, users.id))
    .where(whereClause)
    .orderBy(orderClause)
    .limit(pageSize)
    .offset(offset);

  return c.json({
    data: rows,
    total,
    page,
    pageSize,
    hasMore: offset + pageSize < total,
  });
});

// ─── POST /api/ideas ─────────────────────────────────────────────────
app.post("/", clerkAuth, ensureUser, async (c) => {
  const userId = c.get("userId");

  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const { name, tagline, description, category } = body as {
    name?: string;
    tagline?: string;
    description?: string;
    category?: string;
  };

  if (!name || !tagline || !description || !category) {
    return c.json(
      { error: "name, tagline, description, and category are required" },
      400
    );
  }

  if (name.length > 200 || tagline.length > 500 || description.length > 5000) {
    return c.json({ error: "Field length exceeds maximum" }, 400);
  }

  // Run AI evaluation
  const evaluation = evaluateIdea({ name, tagline, description, category });

  const [created] = await db
    .insert(ideas)
    .values({
      authorId: userId,
      name,
      tagline,
      description,
      category,
      aiScore: evaluation.overallScore,
      marketPotentialScore: evaluation.marketPotentialScore,
      innovationScore: evaluation.innovationScore,
      feasibilityScore: evaluation.feasibilityScore,
      aiFeedback: {
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        summary: evaluation.summary,
      },
    })
    .returning();

  return c.json({ data: created }, 201);
});

// ─── GET /api/ideas/:id ──────────────────────────────────────────────
app.get("/:id", async (c) => {
  const ideaId = c.req.param("id");
  if (!ideaId) {
    return c.json({ error: "Idea ID is required" }, 400);
  }

  const rows = await db
    .select({
      id: ideas.id,
      authorId: ideas.authorId,
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
      authorDisplayName: users.displayName,
      authorUsername: users.username,
      authorAvatarUrl: users.avatarUrl,
      authorClerkId: users.clerkUserId,
    })
    .from(ideas)
    .innerJoin(users, eq(ideas.authorId, users.id))
    .where(eq(ideas.id, ideaId));

  if (rows.length === 0) {
    return c.json({ error: "Idea not found" }, 404);
  }

  const idea = rows[0];

  // Check if current user has voted (optional auth)
  let hasVoted = false;
  const authHeader = c.req.header("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const { verifyToken } = await import("@clerk/backend");
      const payload = await verifyToken(authHeader.slice(7), {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      if (payload?.sub) {
        const user = await db.query.users.findFirst({
          where: eq(users.clerkUserId, payload.sub),
        });
        if (user) {
          const vote = await db.query.votes.findFirst({
            where: and(
              eq(votes.ideaId, ideaId),
              eq(votes.userId, user.id)
            ),
          });
          hasVoted = !!vote;
        }
      }
    } catch {
      // Auth is optional for this endpoint; ignore errors
    }
  }

  return c.json({
    data: {
      ...idea,
      hasVoted,
    },
  });
});

// ─── PATCH /api/ideas/:id ────────────────────────────────────────────
app.patch("/:id", clerkAuth, ensureUser, async (c) => {
  const userId = c.get("userId");
  const ideaId = c.req.param("id");
  if (!ideaId) {
    return c.json({ error: "Idea ID is required" }, 400);
  }

  // Ownership check
  const existing = await db.query.ideas.findFirst({
    where: eq(ideas.id, ideaId),
  });

  if (!existing) {
    return c.json({ error: "Idea not found" }, 404);
  }
  if (existing.authorId !== userId) {
    return c.json({ error: "Not authorized to edit this idea" }, 403);
  }

  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const allowedFields = ["name", "tagline", "description", "category"];
  const updates: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (field in body && typeof body[field] === "string") {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return c.json({ error: "No valid fields to update" }, 400);
  }

  // Re-evaluate if content changed
  const newName = (updates.name as string) || existing.name;
  const newTagline = (updates.tagline as string) || existing.tagline;
  const newDescription = (updates.description as string) || existing.description;
  const newCategory = (updates.category as string) || existing.category;

  const evaluation = evaluateIdea({
    name: newName,
    tagline: newTagline,
    description: newDescription,
    category: newCategory,
  });

  updates.aiScore = evaluation.overallScore;
  updates.marketPotentialScore = evaluation.marketPotentialScore;
  updates.innovationScore = evaluation.innovationScore;
  updates.feasibilityScore = evaluation.feasibilityScore;
  updates.aiFeedback = {
    strengths: evaluation.strengths,
    improvements: evaluation.improvements,
    summary: evaluation.summary,
  };
  updates.updatedAt = new Date();

  const [updated] = await db
    .update(ideas)
    .set(updates)
    .where(eq(ideas.id, ideaId))
    .returning();

  return c.json({ data: updated });
});

// ─── DELETE /api/ideas/:id ───────────────────────────────────────────
app.delete("/:id", clerkAuth, ensureUser, async (c) => {
  const userId = c.get("userId");
  const ideaId = c.req.param("id");
  if (!ideaId) {
    return c.json({ error: "Idea ID is required" }, 400);
  }

  const existing = await db.query.ideas.findFirst({
    where: eq(ideas.id, ideaId),
  });

  if (!existing) {
    return c.json({ error: "Idea not found" }, 404);
  }
  if (existing.authorId !== userId) {
    return c.json({ error: "Not authorized to delete this idea" }, 403);
  }

  await db.delete(ideas).where(eq(ideas.id, ideaId));

  return c.json({ message: "Idea deleted" });
});

// ─── POST /api/ideas/:id/vote ────────────────────────────────────────
app.post("/:id/vote", clerkAuth, ensureUser, async (c) => {
  const userId = c.get("userId");
  const ideaId = c.req.param("id");
  if (!ideaId) {
    return c.json({ error: "Idea ID is required" }, 400);
  }

  // Check idea exists
  const idea = await db.query.ideas.findFirst({
    where: eq(ideas.id, ideaId),
  });
  if (!idea) {
    return c.json({ error: "Idea not found" }, 404);
  }

  try {
    await db.insert(votes).values({ ideaId, userId });
    const [voteCountResult] = await db
      .select({ count: count() })
      .from(votes)
      .where(eq(votes.ideaId, ideaId));
    return c.json({ message: "Vote added", voteCount: voteCountResult.count }, 201);
  } catch (err: any) {
    if (err.message?.includes("unique") || err.code === "23505") {
      const [voteCountResult] = await db
        .select({ count: count() })
        .from(votes)
        .where(eq(votes.ideaId, ideaId));
      return c.json({ error: "Already voted", voteCount: voteCountResult.count }, 409);
    }
    throw err;
  }
});

// ─── DELETE /api/ideas/:id/vote ──────────────────────────────────────
app.delete("/:id/vote", clerkAuth, ensureUser, async (c) => {
  const userId = c.get("userId");
  const ideaId = c.req.param("id");
  if (!ideaId) {
    return c.json({ error: "Idea ID is required" }, 400);
  }

  const deleted = await db
    .delete(votes)
    .where(and(eq(votes.ideaId, ideaId), eq(votes.userId, userId)))
    .returning();

  if (deleted.length === 0) {
    return c.json({ error: "Vote not found" }, 404);
  }

  const [voteCountResult] = await db
    .select({ count: count() })
    .from(votes)
    .where(eq(votes.ideaId, ideaId));

  return c.json({ message: "Vote removed", voteCount: voteCountResult.count });
});

export default app;
