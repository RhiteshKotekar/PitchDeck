# Architecture

## Components

- **Mobile app (`src/`)**: Expo and React Native application. Expo Router screens live in `src/app/`; shared UI, hooks, API helpers, theme, state, and types live alongside them.
- **Backend (`server/`)**: Hono API served by Node.js. It verifies Clerk session tokens, provisions application users, evaluates ideas, and reads and writes PostgreSQL data through Drizzle ORM.
- **Database**: PostgreSQL stores users, ideas, and votes. Schema definitions are in `server/src/db/schema.ts`; SQL migrations are in `server/drizzle/`.

## Request flow

1. A user signs in through Clerk in the app.
2. The client obtains a session token and sends it as a Bearer token for authenticated API requests.
3. The API verifies the token and associates the Clerk user with a database user record.
4. API routes enforce authentication and ownership for mutations, then use Drizzle to access PostgreSQL.

Idea listing and detail reads are public. Creating, editing, deleting, voting, and profile operations require authentication. Editing and deleting an idea are restricted to its author. A database uniqueness constraint allows one vote per user per idea.

## Evaluation

`server/src/services/evaluation.ts` computes scores and feedback deterministically from the idea's name, tagline, description, and category. It is a local scoring routine, not a call to a hosted AI model. Identical input produces identical output.

## Main data entities

- **Users** are keyed by an internal numeric ID and a unique Clerk user ID.
- **Ideas** belong to a user and store their content, evaluation scores, and feedback.
- **Votes** connect a user to an idea and have a unique `(idea_id, user_id)` pair.

## Configuration boundaries

The mobile app needs `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` and `EXPO_PUBLIC_API_URL`. Public Expo variables are bundled into the client. The backend needs `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `DATABASE_URL`, and optionally `PORT`. Never put backend secrets in the mobile app.
