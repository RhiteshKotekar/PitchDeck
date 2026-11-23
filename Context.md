# Pitchboard — Full Context Document

> **Last Updated:** 2026-11-23T11:55:00+05:30
> **Status:** Implementation Complete, EAS Build Environment Variables Configured for Standalone APK

---

## Project Overview

**Pitchboard** is a community-driven startup idea discovery and evaluation mobile application built with React Native and Expo. Users submit startup ideas, receive simulated AI evaluations (scores, strengths, improvements, summary), browse ideas with category filters and sorting, vote on pitches, and compete on the leaderboard.

**Tagline:** "Discover ideas. Challenge assumptions. Find the next big thing."

---

## Design System — "Warm Foundry" (Instagram-Clean)

### Key Rules Followed:
1. **Uncluttered & Clean**: Instagram-style simplicity with generous whitespace, clean line weights, and minimal distraction.
2. **Primary Light Theme**: Default light theme using warm ivory and charcoal typography.
3. **Dark Theme Toggle**: Accessible in Settings, toggles between Light / Dark / System and persists across restarts using `AsyncStorage`.
4. **Color Palette**:
   - Light: Primary `#C65D32`, Primary Dark `#A94B2A`, Secondary `#74816A`, Tertiary `#E6A15C`, Canvas `#F5EFE5`, Surface `#FBF8F2`, Surface Elevated `#FFFDF9`, Text `#292720`, Text Muted `#81786D`, Border `#E6E1D7`, Error `#A94B3C`, Success `#5A7A52`.
   - Dark: Canvas `#211F1B`, Surface `#2B2823`, Surface Elevated `#343029`, Primary `#D4784E`, Text `#F5EFE5`, Text Muted `#B9AEA0`, Border `#494238`.
   - No purple, blue, or neon SaaS accents.
5. **Typography**: Headings: Manrope (`@expo-google-fonts/manrope`); Body: Inter (`@expo-google-fonts/inter`). Fallback provided.

---

## Tech Stack & Installed Packages

| Layer | Technology | Version / Details |
|---|---|---|
| Framework | Expo | SDK 58 (~58.0.23) |
| Core | React Native | 0.88.1, React 19.3.0 |
| Styling | NativeWind v4 + Tailwind CSS | 4.2.7 / 3.4.19 |
| Routing | Expo Router | ~58.0.30 |
| Icons | Feather (`@expo/vector-icons`) | SDK 58 compatible |
| Auth Client | Clerk Expo (`@clerk/clerk-expo`) | with `expo-secure-store` |
| Client State | Zustand (`zustand`) | Optimistic vote store |
| Backend | Hono (`hono`, `@hono/node-server`) | TypeScript, Node.js |
| DB / ORM | Neon PostgreSQL + Drizzle ORM | `@neondatabase/serverless`, `drizzle-orm`, `drizzle-kit` |
| Server Auth | `@clerk/backend` | Server-side JWT verification |
| Testing | Node.js Test Runner + `tsx` | 13 test cases covering logic, bounds, and invariants |

---

## Database Architecture & Schema

### Tables (`server/src/db/schema.ts`):
- `users`:
  - `id` (serial PK)
  - `clerk_user_id` (text UNIQUE NOT NULL)
  - `display_name` (text NOT NULL)
  - `username` (text UNIQUE)
  - `email` (text NOT NULL)
  - `avatar_url`, `bio` (text nullable)
  - `created_at`, `updated_at` (timestamptz)
- `ideas`:
  - `id` (uuid PK default `gen_random_uuid()`)
  - `author_id` (integer FK `users.id` ON DELETE CASCADE)
  - `name`, `tagline`, `description`, `category` (text NOT NULL)
  - `ai_score`, `market_potential_score`, `innovation_score`, `feasibility_score` (integer)
  - `ai_feedback` (jsonb with `strengths`, `improvements`, `summary`)
  - `created_at`, `updated_at` (timestamptz)
- `votes`:
  - `id` (serial PK)
  - `idea_id` (uuid FK `ideas.id` ON DELETE CASCADE)
  - `user_id` (integer FK `users.id` ON DELETE CASCADE)
  - `created_at` (timestamptz)
  - `CONSTRAINT "votes_idea_user_unique" UNIQUE("idea_id", "user_id")`

---

## Core Files Created / Modified

### Backend (`server/`)
- `server/package.json`: Hono, Drizzle, Neon, Clerk backend, TSX scripts.
- `server/tsconfig.json`: Strict TypeScript configuration.
- `server/drizzle.config.ts`: Drizzle Kit configuration.
- `server/drizzle/0000_pale_lifeguard.sql`: Generated SQL migration.
- `server/src/index.ts`: Hono app entry with CORS, Logger, Health, and route mounting.
- `server/src/db/schema.ts`: Drizzle schema with tables & relations.
- `server/src/db/index.ts`: Neon HTTP Drizzle client.
- `server/src/db/migrate.ts`: Migration executor.
- `server/src/db/seed.ts`: Seed script populating demo founders, ideas & votes.
- `server/src/middleware/auth.ts`: `clerkAuth` (verifies Bearer JWT) & `ensureUser` (syncs Clerk identity to DB).
- `server/src/services/evaluation.ts`: Deterministic simulated AI evaluation algorithm.
- `server/src/routes/users.ts`: `/api/me`, `/api/users/me/ideas`, `/api/users/me/stats`.
- `server/src/routes/ideas.ts`: Full CRUD, pagination, category filtering, search, and upvote/unvote endpoints.
- `server/src/routes/leaderboard.ts`: Leaderboard endpoint with `period` (all/week) and `mode` (most_voted/highest_rated).
- `server/test/evaluation.test.ts`: Evaluation tests (bounds 0-100, deterministic, expected fields).
- `server/test/business-logic.test.ts`: Data invariants (input validation, single vote, ownership, leaderboard, stats, theme).
- `server/.env.example`: Server environment template.

### Mobile Client (`src/`)
- `src/theme/tokens.ts`: Warm Foundry design tokens (light & dark).
- `src/theme/ThemeProvider.tsx`: Persistent theme provider with light, dark, and system support.
- `src/theme/index.ts`: Theme barrel export.
- `src/types/index.ts`: Clean TypeScript interfaces for User, Idea, Votes, Leaderboard, and API responses.
- `src/lib/api.ts`: API client with bearer token injection, automated error parsing, and `.data` unwrapping.
- `src/lib/auth.ts`: Secure token cache for Clerk using `expo-secure-store`.
- `src/store/index.ts`: Zustand store for optimistic vote state.
- `src/hooks/useVote.ts`: Custom hook managing optimistic vote updates, rollback, and toast notifications.
- `src/components/ui/`:
  - `AppText`: Typography component with Manrope/Inter weights and Warm Foundry variants.
  - `AppButton`: Accessible button with primary, secondary, outline, ghost, and destructive variants.
  - `IconButton`: 44pt touch target icon button.
  - `TextField` & `PasswordField`: Form inputs with character counters and visibility toggle.
  - `SearchField`: Inline search input with Feather search icon.
  - `CategoryChip`: Selection chip for filtering.
  - `SectionHeader`: Feed section header.
  - `Avatar`: Initials-based avatar fallback.
  - `RatingBadge`: Color-coded score badge.
  - `VoteButton`: Upvote toggle pill showing vote count and active state.
  - `StatCard`: Profile stat card with icon, count, and label.
  - `LoadingIndicator`: Themed spinner.
  - `Skeleton` & `IdeaCardSkeleton`: Clean shimmer-style placeholders.
  - `EmptyState` & `ErrorState`: Friendly empty and retry states.
  - `ConfirmationDialog`: Accessible modal for destructive confirmations.
  - `Toast`: In-app notification toast system with animated slide-in.
- `src/components/ideas/IdeaCard.tsx`: Feed card and featured hero card.
- `src/app/_layout.tsx`: Root layout with Google Fonts loading, Clerk Provider, AuthGate, and Setup Mode banner.
- `src/app/index.tsx`: Redirects to `/(auth)/welcome`.
- `src/app/(auth)/_layout.tsx`: Auth stack navigator.
- `src/app/(auth)/welcome.tsx`: Clean onboarding landing page.
- `src/app/(auth)/sign-up.tsx`: Sign up screen with email verification code step.
- `src/app/(auth)/sign-in.tsx`: Sign in screen with password toggle.
- `src/app/(tabs)/_layout.tsx`: Custom clean bottom tab bar with elevated burnt-orange Create button.
- `src/app/(tabs)/index.tsx`: Discover feed with search, category chips, sort pills, featured card, and pull-to-refresh.
- `src/app/(tabs)/create.tsx`: Pitch creation screen with validation and simulated AI evaluation trigger.
- `src/app/(tabs)/leaderboard.tsx`: Hall of Fame screen with gold/silver/bronze podium and runners-up list.
- `src/app/(tabs)/profile.tsx`: My Ideas and profile stats screen.
- `src/app/idea/[id].tsx`: Idea details screen with circular score indicator, breakdown, strengths, improvements, voting, and sharing.
- `src/app/settings.tsx`: Settings screen with Light/Dark/System theme switcher and sign-out confirmation.
- `.env` & `server/.env`: Excluded in `.gitignore` and untracked from Git's index to safeguard secrets.
- `.env.example` & `server/.env.example`: Committed placeholder templates.

---

## Verification & Test Results

1. **TypeScript Typecheck**:
   - `npx tsc --noEmit` -> **PASSED** (0 errors)
   - `npm --prefix server run build` -> **PASSED** (0 errors)
2. **Automated Unit & Invariant Tests**:
   - `npm --prefix server test` -> **13 of 13 tests PASSED**:
     - Bounded scores (0–100)
     - Expected evaluation schema
     - Deterministic hashing
     - Input validation & character bounds
     - One-vote-per-user enforcement
     - Author ownership check
     - Leaderboard sorting
     - Profile statistics computation
     - Theme preference resolution
3. **Drizzle Migration Generation**:
   - `npm --prefix server run db:generate` -> **PASSED** (`drizzle/0000_pale_lifeguard.sql` generated with unique composite vote constraint).
