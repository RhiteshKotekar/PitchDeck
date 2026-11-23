import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import dotenv from "dotenv";

import usersRoutes from "./routes/users.js";
import ideasRoutes from "./routes/ideas.js";
import leaderboardRoutes from "./routes/leaderboard.js";

dotenv.config();

const app = new Hono();

// ─── Global Middleware ───────────────────────────────────────────────
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// ─── Health ──────────────────────────────────────────────────────────
app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

// ─── Mount Routes ────────────────────────────────────────────────────
app.route("/api", usersRoutes);
app.route("/api/ideas", ideasRoutes);
app.route("/api/leaderboard", leaderboardRoutes);

// ─── 404 ─────────────────────────────────────────────────────────────
app.notFound((c) => c.json({ error: "Not found" }, 404));

// ─── Error Handler ───────────────────────────────────────────────────
app.onError((err, c) => {
  console.error("Unhandled error:", err.message);
  return c.json({ error: "Internal server error" }, 500);
});

// ─── Start Server ────────────────────────────────────────────────────
const port = parseInt(process.env.PORT || "3000", 10);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`🚀 LaunchDeck API server running on http://localhost:${info.port}`);
});

export default app;
