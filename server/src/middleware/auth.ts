import { Context, Next } from "hono";
import { createMiddleware } from "hono/factory";
import { verifyToken } from "@clerk/backend";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

// Extend Hono's context variables
declare module "hono" {
  interface ContextVariableMap {
    clerkUserId: string;
    userId: number; // internal DB user id
  }
}

/**
 * Verifies the Bearer JWT using Clerk and attaches `clerkUserId` to context.
 */
export const clerkAuth = createMiddleware(async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid Authorization header" }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      console.error("CLERK_SECRET_KEY is not configured");
      return c.json({ error: "Server configuration error" }, 500);
    }

    const payload = await verifyToken(token, {
      secretKey,
    });

    if (!payload?.sub) {
      return c.json({ error: "Invalid token payload" }, 401);
    }

    c.set("clerkUserId", payload.sub);
    await next();
  } catch (err) {
    console.error("Token verification failed:", (err as Error).message);
    return c.json({ error: "Invalid or expired token" }, 401);
  }
});

/**
 * Must be used AFTER clerkAuth.
 * Finds or creates the user in the database from the Clerk user ID and
 * attaches the internal DB `userId` to context.
 */
export const ensureUser = createMiddleware(async (c: Context, next: Next) => {
  const clerkUserId = c.get("clerkUserId");
  if (!clerkUserId) {
    return c.json({ error: "Authentication required" }, 401);
  }

  try {
    // Look up existing user
    let user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      // Auto-create user with Clerk ID as placeholder data.
      // The client should call PATCH /api/me to fill in real profile info.
      const [newUser] = await db
        .insert(users)
        .values({
          clerkUserId,
          displayName: "New User",
          email: `${clerkUserId}@placeholder.local`,
        })
        .returning();
      user = newUser;
    }

    c.set("userId", user.id);
    await next();
  } catch (err) {
    console.error("ensureUser failed:", (err as Error).message);
    return c.json({ error: "Failed to resolve user" }, 500);
  }
});
