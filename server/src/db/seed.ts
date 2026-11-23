import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import * as schema from "./schema.js";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Seeding database...");

  // ─── Create demo users ──────────────────────────────────────────────
  const [user1] = await db
    .insert(schema.users)
    .values({
      clerkUserId: "demo_user_alice_001",
      displayName: "Alice Chen",
      username: "alicechen",
      email: "alice@demo.local",
      avatarUrl: null,
      bio: "Serial entrepreneur & product strategist. Passionate about EdTech and sustainability.",
    })
    .onConflictDoNothing({ target: schema.users.clerkUserId })
    .returning();

  const [user2] = await db
    .insert(schema.users)
    .values({
      clerkUserId: "demo_user_bob_002",
      displayName: "Bob Martinez",
      username: "bobm",
      email: "bob@demo.local",
      avatarUrl: null,
      bio: "Full-stack developer turned founder. Building the future of health tech.",
    })
    .onConflictDoNothing({ target: schema.users.clerkUserId })
    .returning();

  const [user3] = await db
    .insert(schema.users)
    .values({
      clerkUserId: "demo_user_carol_003",
      displayName: "Carol Okafor",
      username: "carol_o",
      email: "carol@demo.local",
      avatarUrl: null,
      bio: "UX designer & startup advisor. Focused on making technology accessible.",
    })
    .onConflictDoNothing({ target: schema.users.clerkUserId })
    .returning();

  if (!user1 || !user2 || !user3) {
    console.log("Users already exist. Fetching existing...");
    const existingUsers = await db.select().from(schema.users).limit(3);
    if (existingUsers.length < 3) {
      console.error("Not enough users in DB to seed ideas. Exiting.");
      process.exit(1);
    }
    console.log("Using existing users for ideas.");
    await seedIdeas(existingUsers[0], existingUsers[1], existingUsers[2]);
    return;
  }

  await seedIdeas(user1, user2, user3);
}

async function seedIdeas(
  user1: schema.User,
  user2: schema.User,
  user3: schema.User
) {
  // ─── Create ideas ──────────────────────────────────────────────────
  const idea1Id = uuidv4();
  const idea2Id = uuidv4();
  const idea3Id = uuidv4();
  const idea4Id = uuidv4();

  const ideasData = [
    {
      id: idea1Id,
      authorId: user1.id,
      name: "StudySync",
      tagline: "AI-powered collaborative learning platform for university students",
      description:
        "StudySync connects students across universities into smart study groups based on their courses, learning styles, and schedules. The platform uses AI to generate personalized study plans, flashcard decks, and practice quizzes. Features include real-time collaborative note-taking, video study rooms, and spaced-repetition learning tools. StudySync also integrates with university LMS systems to automatically organize course materials.",
      category: "EdTech",
      aiScore: 82,
      marketPotentialScore: 85,
      innovationScore: 78,
      feasibilityScore: 83,
      aiFeedback: {
        strengths: [
          "Addresses a clear and validated market need",
          "Strong potential for recurring revenue model",
          "Scalable across multiple demographics",
        ],
        improvements: [
          "Consider a more detailed competitive analysis",
          "Develop a clearer go-to-market strategy",
          "Add more specifics on user acquisition channels",
        ],
        summary:
          '"StudySync" is a highly promising concept in the EdTech space. With a market potential score of 85 and an innovation score of 78, it demonstrates solid foundations for growth. Focus on the recommended improvements to maximize your chances of success.',
      },
    },
    {
      id: idea2Id,
      authorId: user2.id,
      name: "GreenCart",
      tagline: "Carbon footprint-aware grocery shopping and meal planning app",
      description:
        "GreenCart helps environmentally conscious consumers make sustainable food choices. The app scans grocery items to show their carbon footprint, suggests lower-impact alternatives, and creates weekly meal plans that minimize environmental impact while meeting nutritional needs. Users earn rewards for sustainable choices which can be redeemed at partner stores. Features a community sharing platform for eco-friendly recipes.",
      category: "Sustainability",
      aiScore: 76,
      marketPotentialScore: 79,
      innovationScore: 74,
      feasibilityScore: 72,
      aiFeedback: {
        strengths: [
          "Aligns with current market trends",
          "Compelling unique value proposition",
          "High user retention probability",
        ],
        improvements: [
          "Explore partnerships for faster market entry",
          "Strengthen the technical architecture plan",
          "Define key metrics and success criteria early",
        ],
        summary:
          '"GreenCart" is a promising concept in the Sustainability space. With a market potential score of 79 and an innovation score of 74, it demonstrates solid foundations for growth. Focus on the recommended improvements to maximize your chances of success.',
      },
    },
    {
      id: idea3Id,
      authorId: user2.id,
      name: "MediTrack",
      tagline: "Personal health dashboard with AI-driven insights and medication reminders",
      description:
        "MediTrack consolidates all personal health data — vitals, medications, lab results, doctor visits — into a single secure dashboard. Its AI engine detects trends, flags potential interactions between medications, and provides actionable health insights. The app sends smart medication reminders that adapt to the user's routine and integrates with wearable devices for continuous health monitoring. HIPAA-compliant with end-to-end encryption.",
      category: "HealthTech",
      aiScore: 88,
      marketPotentialScore: 91,
      innovationScore: 83,
      feasibilityScore: 87,
      aiFeedback: {
        strengths: [
          "Addresses a clear and validated market need",
          "Clear path to monetization",
          "Leverages existing technology infrastructure",
        ],
        improvements: [
          "Consider regulatory and compliance requirements",
          "Build a stronger brand differentiation strategy",
          "Develop a contingency plan for key risks",
        ],
        summary:
          '"MediTrack" is a highly promising concept in the HealthTech space. With a market potential score of 91 and an innovation score of 83, it demonstrates solid foundations for growth. Focus on the recommended improvements to maximize your chances of success.',
      },
    },
    {
      id: idea4Id,
      authorId: user3.id,
      name: "SkillBridge",
      tagline: "Peer-to-peer micro-mentoring platform connecting professionals across industries",
      description:
        "SkillBridge matches professionals who want to learn new skills with experienced mentors for short, focused 30-minute sessions. Unlike traditional mentoring platforms, SkillBridge focuses on specific skills rather than general career advice. The AI matching algorithm considers skill gaps, learning goals, industry context, and scheduling preferences. Features include session recordings, progress tracking, skill verification badges, and a knowledge marketplace.",
      category: "Professional Development",
      aiScore: 71,
      marketPotentialScore: 73,
      innovationScore: 68,
      feasibilityScore: 70,
      aiFeedback: {
        strengths: [
          "Strong network effects built into the model",
          "Low customer acquisition cost potential",
          "Solves a pain point with measurable impact",
        ],
        improvements: [
          "Outline a phased MVP approach",
          "Plan for international expansion early",
          "Identify and mitigate single points of failure",
        ],
        summary:
          '"SkillBridge" is a promising concept in the Professional Development space. With a market potential score of 73 and an innovation score of 68, it demonstrates solid foundations for growth. Focus on the recommended improvements to maximize your chances of success.',
      },
    },
  ];

  for (const idea of ideasData) {
    await db
      .insert(schema.ideas)
      .values(idea)
      .onConflictDoNothing({ target: schema.ideas.id });
  }

  console.log("  ✅ Created 4 ideas");

  // ─── Create votes ──────────────────────────────────────────────────
  const votesData = [
    // StudySync gets votes from Bob and Carol
    { ideaId: idea1Id, userId: user2.id },
    { ideaId: idea1Id, userId: user3.id },
    // GreenCart gets vote from Alice
    { ideaId: idea2Id, userId: user1.id },
    // MediTrack gets votes from Alice and Carol
    { ideaId: idea3Id, userId: user1.id },
    { ideaId: idea3Id, userId: user3.id },
    // SkillBridge gets votes from Alice and Bob
    { ideaId: idea4Id, userId: user1.id },
    { ideaId: idea4Id, userId: user2.id },
  ];

  for (const vote of votesData) {
    await db.insert(schema.votes).values(vote).onConflictDoNothing();
  }

  console.log("  ✅ Created votes");
  console.log("🌱 Seeding complete!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
