# Pitchboard 🚀

**Discover ideas. Challenge assumptions. Find the next big thing.**

Pitchboard is a mobile discovery and evaluation platform for early-stage startup ideas built with React Native and Expo. Builders can showcase their startup concepts, receive instant simulated AI evaluations, browse community ideas, and climb the leaderboard.

---

## 📸 Design Philosophy: "Warm Foundry" & Instagram-Clean

- **Uncluttered & Minimalist**: Built with an Instagram-inspired layout focusing on generous whitespace, clean typographic hierarchy, and clear focal points without distracting banners or dense widget clutter.
- **Light Theme Primary**: Clean ivory canvas (`#F5EFE5`), elevated paper surfaces (`#FBF8F2`), burnt-orange primary actions (`#C65D32`), charcoal typography (`#292720`), and muted sage accents (`#74816A`).
- **Dark Theme Toggle**: Accessible anytime from User Settings (`Settings` screen), fully persisting across app restarts using custom theme tokens (`#211F1B` canvas, `#2B2823` surface).
- **Restrained Aesthetics**: No purple or blue SaaS gradients, no neon accents, no generic cookie-cutter components. Built with pure React Native primitives styled via NativeWind design tokens.

---

## 🛠 Tech Stack

### Mobile Client
- **Framework**: Expo (SDK 58) + React Native 0.88 + React 19
- **Routing**: Expo Router (File-based navigation with custom bottom tabs)
- **Styling**: NativeWind v4 + Tailwind CSS (Warm Foundry custom design system)
- **Typography**: Google Fonts (Manrope for bold headlines + Inter for crisp body copy)
- **Icons**: Feather Icons (`@expo/vector-icons`)
- **Authentication**: Clerk Expo (`@clerk/clerk-expo`) with encrypted secure token caching (`expo-secure-store`)
- **State Management**: Zustand (Optimistic voting & local client state)
- **Theme**: Custom React Context theme engine with persistent AsyncStorage caching

### Backend API (`server/`)
- **Framework**: Hono TypeScript running on Node.js / `@hono/node-server`
- **Database**: Neon Serverless PostgreSQL (`@neondatabase/serverless`)
- **ORM & Migrations**: Drizzle ORM + Drizzle Kit
- **Auth Verification**: Server-side JWT verification using `@clerk/backend`
- **Evaluation Engine**: Deterministic simulated AI scoring service (0–100 overall, market potential, innovation, feasibility, actionable strengths & improvement tips)

---

## 🏗 Architecture

```text
┌──────────────────────────────────────────────┐
│          Expo React Native App               │
│  (Custom Tabs, Warm Foundry Design System)   │
└──────────────────────┬───────────────────────┘
                       │
                       │ Bearer JWT (Clerk Session)
                       ▼
┌──────────────────────────────────────────────┐
│              Hono Backend API                │
│   - Clerk Token Verification Middleware      │
│   - User Provisioning & Ownership Checks     │
│   - Simulated AI Evaluation Engine           │
│   - Rate-safe CRUD & Paginated Endpoints     │
└──────────────────────┬───────────────────────┘
                       │
                       │ Parameterized SQL via Drizzle
                       ▼
┌──────────────────────────────────────────────┐
│            Neon PostgreSQL DB                │
│   - users (clerk_user_id, profile)           │
│   - ideas (scores, feedback, category)       │
│   - votes (UNIQUE idea_id + user_id)         │
└──────────────────────────────────────────────┘
```

Neon credentials and Clerk secret keys live exclusively on the backend server. The mobile client only holds the publishable key and communicates through the authenticated API.

---

## 📋 Features

1. **Onboarding & Authentication**
   - Clean welcome screen with brand mark and value proposition.
   - Real Clerk sign-up with email verification code entry.
   - Sign-in with password visibility toggle and friendly validation.
   - Secure token storage via `expo-secure-store`.
   - Setup Mode fallback: If Clerk key is not yet configured, a helpful setup guide appears without crashing the app.

2. **Discover Feed**
   - Founder greeting ("Good morning / afternoon, founder").
   - Live search across startup names, taglines, and descriptions.
   - Category filtering (Technology, Health, Education, Finance, Sustainability, etc.).
   - Sort controls: Trending, Newest, Top Rated, and Most Voted.
   - Featured startup hero card.
   - Micro-cards with AI score badges, vote buttons, and author details.
   - Pull-to-refresh & skeleton loaders.

3. **Pitch Creation & Simulated AI Evaluation**
   - Distraction-free submission form (Startup name, tagline, description, category selector).
   - Instant simulated evaluation generating:
     - Overall Score (0–100)
     - Market Potential score
     - Innovation score
     - Feasibility score
     - "What looks promising" (key strengths)
     - "Areas to improve" (actionable next steps)
     - Executive evaluation summary
   - Persisted in Neon database so scores remain consistent.

4. **Idea Details & Interactive Voting**
   - Full pitch description and author credentials.
   - Circular score indicator with qualitative tier ("Exceptional potential", "Promising potential", etc.).
   - Optimistic voting system with backend reconciliation (one vote per user enforced).
   - Native share integration (shares idea name, tagline, and score).
   - Delete/edit permissions enforced by server-side author ownership check.

5. **Hall of Fame (Leaderboard)**
   - Top-3 podium (Warm gold, muted silver, copper bronze).
   - Ranked list for runners-up with score and vote tally.
   - Filters: "All Time" vs "This Week", and "Most Voted" vs "Highest Rated".
   - Calculated entirely from database records.

6. **Profile & User Settings**
   - Founder stats card: total ideas submitted, total votes received, average AI score.
   - List of personal submitted ideas.
   - Light / Dark / System theme selector that persists immediately.
   - One-tap sign out with confirmation dialog.

---

## 🔑 Environment Variables Setup

### 1. Mobile App (`.env`)

Create a `.env` file in the project root:

```bash
# Copy from example
cp .env.example .env
```

Set the variables:
```env
# Clerk Publishable Key (From Clerk Dashboard -> API Keys)
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Backend API URL
# Local development on web/iOS simulator:
EXPO_PUBLIC_API_URL=http://localhost:3000

# For Android Emulator:
# EXPO_PUBLIC_API_URL=http://10.0.2.2:3000

# For Physical Device (replace with your machine's LAN IP):
# EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

### 2. Backend Server (`server/.env`)

Create `server/.env`:

```bash
# Copy from example
cp server/.env.example server/.env
```

Set the variables:
```env
# Neon PostgreSQL Connection String (From Neon Console -> Connection String)
DATABASE_URL=postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require

# Clerk Secret Key (From Clerk Dashboard -> API Keys)
CLERK_SECRET_KEY=sk_test_...

# Clerk Publishable Key (From Clerk Dashboard -> API Keys)
CLERK_PUBLISHABLE_KEY=pk_test_...

# Port (default 3000)
PORT=3000
```

---

## 🗄 Database Setup (Neon PostgreSQL)

1. Sign up at [neon.tech](https://neon.tech) and create a new project named `pitchboard`.
2. Copy the PostgreSQL connection string from the Neon dashboard.
3. Paste it into `DATABASE_URL` in `server/.env`.
4. Run migrations from the project root:

```bash
npm --prefix server run db:migrate
```

5. (Optional) Populate the database with realistic demo startups and founders:

```bash
npm --prefix server run db:seed
```
*Seeds 4 realistic ideas (StudySync, GreenCart, MediTrack, SkillBridge) with AI feedback and votes.*

---

## 🔐 Clerk Authentication Setup

1. Create a free account at [clerk.com](https://clerk.com).
2. Create a new application named **Pitchboard**.
3. Under **User & Authentication** > **Email, Phone, Username**:
   - Enable **Email address** with **Email verification code**.
   - Enable **Password**.
4. Go to **API Keys** in Clerk Dashboard:
   - Copy **Publishable Key** into `.env` as `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`.
   - Copy **Secret Key** into `server/.env` as `CLERK_SECRET_KEY`.

---

## 🚀 Running the Project

### Start the Backend Server

```bash
npm --prefix server run dev
```
The Hono API will start on `http://localhost:3000`. Test health:
```bash
curl http://localhost:3000/health
# {"status":"ok","timestamp":"..."}
```

### Start the Mobile Application

```bash
npx expo start
```

Press:
- `w` to open in Web browser
- `a` to open in Android Emulator
- `i` to open in iOS Simulator
- Scan QR code with Expo Go on a physical phone

---

## 🧪 Testing & Verification

Run the automated backend and business logic test suite:

```bash
npm --prefix server test
```

Tests verify:
- ✅ Simulated AI score stays within bounded range (0–100)
- ✅ Simulated AI feedback contains all structured keys (strengths, improvements, summary)
- ✅ Deterministic scoring consistency
- ✅ Field length and required validation
- ✅ Unique one-vote-per-user constraint
- ✅ Author ownership validation for editing and deleting
- ✅ Leaderboard sorting rules (most voted vs highest rated)
- ✅ Profile stats computation
- ✅ Theme preference resolution

Run TypeScript typecheck across client and server:

```bash
# Client Typecheck
npx tsc --noEmit

# Server Build Check
npm --prefix server run build
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/health` | No | Server health check |
| `GET` | `/api/ideas` | No (Optional) | List ideas (paginated, sorted, filtered) |
| `POST` | `/api/ideas` | Yes | Submit new idea & generate AI evaluation |
| `GET` | `/api/ideas/:id` | No (Optional) | Get single idea details + vote state |
| `PATCH` | `/api/ideas/:id` | Yes (Owner) | Update idea content & re-evaluate |
| `DELETE` | `/api/ideas/:id` | Yes (Owner) | Delete idea |
| `POST` | `/api/ideas/:id/vote` | Yes | Upvote idea (returns updated vote count) |
| `DELETE` | `/api/ideas/:id/vote` | Yes | Remove vote (returns updated vote count) |
| `GET` | `/api/leaderboard` | No | Get ranked leaderboard (all time / weekly) |
| `GET` | `/api/me` | Yes | Get current user profile |
| `PATCH` | `/api/me` | Yes | Update user profile |
| `GET` | `/api/users/me/ideas` | Yes | Get ideas authored by current user |
| `GET` | `/api/users/me/stats` | Yes | Get aggregate user statistics |
