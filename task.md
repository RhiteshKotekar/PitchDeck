# Antigravity Build Prompt --- Pitchboard

> **Goal:** Build the complete Pitchboard mobile application in the
> existing repository. This is an implementation task, not a request for
> mockups or a plan. Inspect the project first, then implement, run,
> test, and document the application.

------------------------------------------------------------------------

## 1. Your role and working rules

Act as a senior React Native / Expo engineer, product designer, and
full-stack engineer.

Build **Pitchboard**, a polished community-driven startup idea discovery
and evaluation app. Users can create accounts, submit startup ideas,
receive simulated AI feedback, browse and upvote other ideas, and view a
leaderboard.

The repository already contains an Expo + React Native project and
NativeWind setup. **Work inside the existing repository. Do not create a
new app or replace the project configuration without a concrete
technical reason.**

Before changing anything:

1.  Inspect the complete repository structure.
2.  Read `package.json`, lockfile, `app.json` / `app.config.*`,
    `babel.config.*`, `metro.config.*`, `tailwind.config.*`,
    `tsconfig.json`, and existing source files.
3.  Identify the installed Expo SDK, React Native, React, NativeWind,
    Expo Router (if present), and other relevant versions.
4.  Run the existing project and identify current errors.
5.  Check current official Clerk, Expo, NativeWind, and Neon
    documentation for the installed versions. Do not rely on outdated
    setup snippets or invent package APIs.
6.  Create a short implementation checklist, then proceed with
    implementation. Do not stop after producing a plan.

### Non-negotiable rules

-   Use **React Native + Expo + TypeScript**.
-   Use **NativeWind** for styling, following the version already
    installed or a compatible upgrade only if required.
-   Build custom reusable UI components.
-   Do not use platform-specific native UI kits or prebuilt component
    libraries such as React Native Paper, NativeBase, Tamagui, or UI
    Kitten.
-   Do not use UIKit/Cupertino widgets or Android-specific Material
    native widgets.
-   Use React Native primitives (`View`, `Text`, `Pressable`,
    `TextInput`, `ScrollView`, `FlatList`, etc.) as the low-level
    rendering primitives, wrapped in your own custom components. These
    primitives are unavoidable; the restriction is against
    platform-specific or prebuilt UI components.
-   The visual design and interaction should be consistent on Android
    and iOS. Account for safe areas, keyboard behavior,
    status/navigation bars, and platform differences without changing
    the visual design by platform.
-   Do not use WebViews to fake a mobile app.
-   Do not leave placeholder screens, dead buttons, fake navigation, or
    TODO-only functionality.
-   Do not hardcode secrets, API keys, credentials, or database
    connection strings in source code.
-   Do not expose Neon credentials or connect directly to Neon from the
    mobile client.
-   Do not claim a feature works unless it has been implemented and
    tested.
-   Preserve existing working code and configuration wherever possible.

If a requested integration requires credentials that are not available,
implement the integration correctly, add clear environment variable
placeholders and setup instructions, and explain exactly what the
developer must configure. Never fabricate credentials.

------------------------------------------------------------------------

## 2. Product identity and design direction

### Product name

**Pitchboard**

Tagline: **Discover ideas. Challenge assumptions. Find the next big
thing.**

Pitchboard should feel like a credible early-stage startup product, not
a college CRUD assignment. The experience should combine the clarity of
a modern discovery platform with the personality of a founder community.

### Visual direction: Warm Foundry

Use a warm, earthy, editorial visual identity built on a custom design
system inspired by **Google Material Design 3 principles**.

Material 3 is a design reference for color roles, hierarchy, spacing,
accessibility, states, and interaction patterns. Do not use a Material
component library or default Material UI appearance.

#### Color palette

Use these as the initial design tokens and refine them only when needed
for contrast and consistency:

  Token              Color       Usage
  ------------------ ----------- ---------------------------------------------
  Primary            `#C65D32`   Main actions, selected states, key emphasis
  Primary dark       `#A94B2A`   Pressed states and stronger emphasis
  Secondary          `#74816A`   Secondary actions, supportive accents
  Tertiary           `#E6A15C`   Ratings, highlights, achievement accents
  Background         `#F5EFE5`   Main light-mode background
  Surface            `#FBF8F2`   Cards, sheets, inputs
  Surface elevated   `#FFFDF9`   Elevated surfaces
  Text primary       `#292720`   Main text
  Text secondary     `#81786D`   Supporting text
  Border             `#E6E1D7`   Dividers and outlines
  Error              `#A94B3C`   Errors and destructive states

**Color restrictions:** - No purple. - No blue. - No generic
blue-and-white SaaS palette. - No neon accents. - Avoid excessive
gradients, glassmorphism, and heavy shadows. - Do not apply gradients to
every card. Use them sparingly, if at all.

Use warm ivory backgrounds, charcoal typography, burnt-orange primary
actions, muted sage secondary accents, and amber for ratings or
achievements.

### Typography

Use Manrope for headings and prominent numerical metrics, and Inter for
body text and supporting information. If font files are needed, use a
compatible Expo font-loading approach and include the required assets.
Provide a sensible fallback while fonts load.

### Layout and component principles

-   Mobile-first layouts designed around a 393 × 852 logical-pixel
    reference viewport.
-   Consistent 8-point spacing scale.
-   Cards generally use 16--20dp corner radii.
-   Clear hierarchy and generous whitespace.
-   Subtle tonal elevation, not large shadows.
-   Accessible contrast and readable text sizes.
-   Interactive targets should be comfortably tappable (aim for at least
    44--48 logical points).
-   Consistent icon style and stroke weight.
-   Avoid emoji as the primary icon system. Use a consistent icon
    library already installed, or add a compatible lightweight icon
    package if necessary.
-   Do not rely on platform-default font, button, input, or navigation
    styling.

### Dark mode

Implement a complete dark theme, not a simple inversion.

Suggested dark tokens: - Background: `#211F1B` - Surface: `#2B2823` -
Elevated surface: `#343029` - Primary: a softened burnt orange with
sufficient contrast - Secondary: muted sage - Tertiary: warm amber -
Main text: `#F5EFE5` - Secondary text: `#B9AEA0` - Border: `#494238`

Theme selection must persist across app restarts. Use a custom theme
provider and design tokens so all screens and components respond
consistently.

------------------------------------------------------------------------

## 3. Application architecture

Use a maintainable, feature-oriented structure. Adapt to the
repository's existing Expo Router or navigation setup rather than
replacing it unnecessarily.

Suggested organization (adjust to the actual repository):

``` text
src/
  app/                  # Routes if using Expo Router
  components/
    ui/                 # Buttons, inputs, cards, chips, sheets, loaders
    ideas/              # IdeaCard, VoteButton, RatingDisplay
    navigation/
  features/
    auth/
    discover/
    ideas/
    evaluation/
    leaderboard/
    profile/
    settings/
  hooks/
  lib/
    api/
    auth/
    validation/
  providers/
  store/
  theme/
  types/
  utils/

server/                 # Secure backend if the repo has no existing backend
  src/
    routes/
    middleware/
    db/
    services/
    validation/
```

Use clear TypeScript types and avoid `any` unless there is a documented
reason.

Use a sensible state-management approach. Zustand is acceptable if it
adds value; do not introduce Redux for this app. Separate server data
from temporary UI state.

Use a robust data-fetching approach with loading, error, empty, and
success states. If adding a data-fetching library, choose one compatible
with the installed Expo / React Native versions.

------------------------------------------------------------------------

## 4. Authentication --- Clerk

Implement real authentication using **Clerk**, not a fake local login
screen.

Use the current official Clerk integration supported by the installed
Expo SDK and React Native versions. Read the current Clerk documentation
before implementation.

### Required authentication flows

1.  Welcome / onboarding screen.
2.  Sign up.
3.  Sign in.
4.  Email verification, if required by the selected Clerk sign-in
    strategy.
5.  Forgot password / password reset, where supported by the chosen
    flow.
6.  Sign out.
7.  Authenticated session persistence.
8.  Protected application routes.
9.  Account/profile screen backed by the authenticated Clerk user.

Use Clerk's supported authentication methods. If email/password is
enabled, implement its actual verification and error states. Social
sign-in may be added only if it can be configured correctly; do not
display nonfunctional Google or Apple buttons.

### Authentication UX

Create custom-styled screens consistent with Pitchboard: - Warm Foundry
background and typography. - Pitchboard wordmark / simple brand mark. -
Email and password fields. - Password visibility toggle. - Field
validation. - Clear loading state. - Helpful authentication error
messages. - Terms/privacy acknowledgement where appropriate. - Link
between sign-in and sign-up. - Keyboard-aware layout.

### Security requirements

-   Clerk is the identity provider. Do not store passwords in Neon or
    AsyncStorage.
-   Use the Clerk user ID as the stable identity reference in the
    application database.
-   Do not trust a user ID supplied by the mobile client. The backend
    must derive the authenticated identity from a verified Clerk session
    token.
-   Protect all private API endpoints with server-side Clerk token
    verification using the current supported Clerk backend SDK.
-   Never put Clerk secret keys in the mobile app.
-   Only the Clerk publishable key may be included in the client
    configuration.
-   Handle signed-out, expired-session, and unauthorized states cleanly.

------------------------------------------------------------------------

## 5. Database and backend --- Neon PostgreSQL

Use **Neon PostgreSQL** as the persistent application database.

Important distinction: Clerk handles authentication and Neon stores
application data. Neon is not the authentication provider.

### Secure architecture

The mobile app must communicate with a backend API. The backend verifies
Clerk authentication and accesses Neon.

**Expected flow:**

``` text
Expo React Native App
        |
        | Clerk session token
        v
Backend API
        |
        | Verify Clerk token
        | Validate request and permissions
        v
Neon PostgreSQL
```

Do not connect directly to Neon from the mobile application. Do not
bundle the Neon connection string in the app.

If the repository has no backend, create a small, clearly separated
TypeScript backend using a suitable framework such as Express or Hono.
Keep it lightweight and compatible with the deployment approach
documented in the README.

Use the current Neon-supported PostgreSQL connection approach and a safe
database access library such as Drizzle ORM or parameterized SQL. Do not
concatenate untrusted values into SQL queries.

### Database schema

Create migrations and appropriate indexes for at least these entities:

#### `users`

-   `id` --- internal primary key.
-   `clerk_user_id` --- unique, indexed Clerk identity.
-   `display_name`.
-   `username` --- unique where supplied.
-   `email` --- synchronized from trusted Clerk data where appropriate.
-   `avatar_url`.
-   `bio`.
-   `created_at`.
-   `updated_at`.

Do not treat client-submitted email or display name as verified identity
data. Use trusted Clerk data or a verified synchronization mechanism.

#### `ideas`

-   `id` --- UUID primary key.
-   `author_id` --- foreign key to users.
-   `name`.
-   `tagline`.
-   `description`.
-   `category`.
-   `ai_score` --- integer from 0 to 100.
-   `market_potential_score`.
-   `innovation_score`.
-   `feasibility_score`.
-   `ai_feedback` --- structured JSON or normalized fields for strengths
    and improvements.
-   `created_at`.
-   `updated_at`.

#### `votes`

-   `id`.
-   `idea_id` --- foreign key.
-   `user_id` --- foreign key.
-   `created_at`.
-   Unique constraint on `(idea_id, user_id)` to enforce one vote per
    user per idea.

#### Optional supporting tables

-   `user_preferences` for theme and notification preferences.
-   `idea_views` only if view tracking is actually implemented.
-   `reports` only if a report feature is implemented.

Use foreign keys, indexes, appropriate constraints, and migrations. Add
seed data for a useful first-run experience. Seed data must be clearly
identifiable as demo content.

### Backend API

Implement and document a clean API. Suggested endpoints:

``` text
GET    /health

GET    /api/me
PATCH  /api/me

GET    /api/ideas
POST   /api/ideas
GET    /api/ideas/:id
PATCH  /api/ideas/:id
DELETE /api/ideas/:id

POST   /api/ideas/:id/vote
DELETE /api/ideas/:id/vote

GET    /api/leaderboard
GET    /api/users/me/ideas
```

Requirements: - Validate all inputs on the server. - Enforce ownership
for editing and deleting ideas. - Enforce one vote per user per idea at
the database level and in API behavior. - Use pagination for idea
feeds. - Support sorting by newest, highest rating, and most votes. - Do
not trust client-provided vote counts or leaderboard ranks. - Compute
vote counts and leaderboard results from database data. - Return
consistent JSON response shapes and meaningful HTTP status codes. -
Handle database errors without leaking credentials or internal stack
traces. - Add basic rate limiting to sensitive write endpoints if
practical. - Use transactions where multiple database operations must
succeed together.

### Environment variables

Create `.env.example` files with placeholders only.

Mobile app variables should use the correct Expo public-variable
convention, for example:

``` env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_API_URL=
```

Backend variables should be kept server-side:

``` env
CLERK_SECRET_KEY=
DATABASE_URL=
CLERK_JWKS_URL=
PORT=
```

Only include variables that the selected SDK and implementation actually
require. Prefer the official Clerk SDK's supported token-verification
configuration rather than manually inventing a JWKS setup.

Never commit real `.env` files. Add them to `.gitignore`.

Document where to obtain each credential and where it belongs. If the
backend requires a public URL for mobile testing, explain how to
configure it for local development and deployment.

------------------------------------------------------------------------

## 6. Main application navigation

After successful authentication, show a custom bottom navigation bar
with four destinations:

1.  **Discover**
2.  **Leaderboard**
3.  **Create**
4.  **My Ideas**

The Create action should be visually emphasized using the primary
burnt-orange color.

Use a custom navigation appearance, not platform-specific tab bars. Use
the repository's navigation framework for routing and history, but
implement the visual navigation UI yourself.

Ensure: - Active and inactive states are clear. - Navigation works on
Android and iOS. - Back navigation behaves sensibly. - Authentication
routes cannot be accessed as authenticated content. - The selected tab
and relevant navigation state behave consistently.

------------------------------------------------------------------------

## 7. Screen requirements

### A. Welcome / onboarding

Create a polished first-launch screen: - Pitchboard branding. -
Headline: "Big ideas deserve a bigger stage." - Supporting copy
explaining the community. - Primary CTA: "Get started". - Secondary CTA:
"I already have an account". - A restrained illustration or custom
decorative graphic related to ideas, pitching, or collaboration.

Do not create a long onboarding carousel. Keep the path to registration
short.

### B. Discover / home

Header: - "Good morning, founder." - Supporting line: "What's the next
big idea?" - Profile avatar. - Optional notification entry only if it
has a real destination.

Include: - Search. - Category filter chips. - Featured startup card. -
Trending ideas. - Recently submitted ideas. - Sort controls: Trending,
Newest, Highest Rated, Most Voted.

Each idea card should display: - Startup name. - Tagline. - Short
description. - Category. - AI score out of 100. - Vote count. - Author
name/avatar. - Upvote action. - Trending indicator where relevant.

Use realistic sample content and avoid lorem ipsum.

Suggested demo ideas:

**StudySync** --- "Make collaborative learning effortless."\
A platform that helps students form study groups and share learning
resources.

**GreenCart** --- "Shopping that leaves a lighter footprint."\
A sustainable shopping platform connecting consumers with
environmentally responsible products.

**MediTrack** --- "Your health records, finally in one place."\
A personal health-record management platform for organizing medical
documents.

**SkillBridge** --- "Turn your skills into opportunities."\
A platform connecting students with real-world micro-internships and
projects.

The feed must load from the backend. Use seed data to populate the
initial experience.

### C. Create idea

Design this as a founder preparing a pitch, not a generic data-entry
form.

Header: - "Bring your idea to life." - "Every great startup starts
somewhere. Tell us yours."

Fields: 1. Startup name. 2. Tagline. 3. Description. 4. Category.

Include: - Helpful placeholders. - Character counters and sensible
limits. - Inline validation. - Category selector using custom chips or a
custom bottom sheet. - Clear keyboard behavior. - Submit/evaluate CTA. -
Confirmation or error feedback.

Validate on the client for usability and again on the server for
security.

### D. Simulated AI evaluation

This assignment requires a **fake/simulated AI-generated rating**, not a
real AI model integration.

Implement a deterministic or randomized-but-bounded evaluation service
that returns: - Overall score from 0--100. - Market potential score. -
Innovation score. - Feasibility score. - A few strengths. - A few areas
for improvement. - A short summary.

The score and feedback should be generated through a clearly isolated
service so a real AI provider could be integrated later.

Do not make scores purely cosmetic or inconsistent between refreshes.
Generate the evaluation once when the idea is submitted and persist the
result in Neon.

Label the feature discreetly as **"Simulated AI evaluation"** so users
are not misled.

Evaluation screen: - "Your idea has been evaluated." - Submitted startup
name and tagline. - Large score presentation, e.g. `82 / 100`. - Score
interpretation such as "Promising potential". - Circular score indicator
or custom score visualization. - Market potential, innovation, and
feasibility breakdown. - "What looks promising" section. - "Areas to
improve" section. - Actions: Publish idea, Edit idea, Share evaluation.

Use a restrained score-reveal animation. Respect reduced-motion
preferences where practical.

### E. Idea details

Show: - Startup name and tagline. - Full description. - Category. -
Author details. - Submission date. - AI score and breakdown. - Strengths
and improvements. - Community vote count. - Upvote action. - Share
action. - Related ideas if relevant data is available.

Voting must update the UI optimistically only when safe, then reconcile
with the backend response. If the request fails, restore the previous
state and show an error.

A user must not be able to vote twice for the same idea. The UI should
show a distinct voted state.

### F. Leaderboard

Header: - "Hall of Fame" - "The ideas getting the most attention."

Filters: - This Week. - All Time.

Ranking mode: - Most Voted. - Highest Rated.

Show a refined top-three podium: - First: warm gold/amber. - Second:
muted silver. - Third: copper/bronze.

Show ranks four and five as compact cards.

Each row should include: - Rank. - Startup name. - Author. - Category. -
AI score. - Vote count.

Leaderboard data must come from the backend/database, not a hardcoded
array. Make the sorting rule clear. If a weekly filter is implemented,
calculate it using actual vote/idea timestamps and document the rule.

### G. My Ideas / profile

Show: - Profile avatar. - Display name. - Username. - Bio. - Edit
profile action. - Ideas submitted. - Total votes received. - Average AI
score. - List of the user's submitted ideas.

Each idea card should show: - Name. - AI score. - Vote count. -
Submission date. - Edit action for the owner.

The profile must be associated with the signed-in Clerk account and
backed by the `users` table. Provide a reliable first-login user
provisioning or synchronization flow.

### H. Settings

Include: - Light/dark/system theme preference. - Profile editing. - Sign
out. - App version/about section. - Privacy and terms placeholders only
if actual destinations or content are provided.

Do not show nonfunctional settings.

------------------------------------------------------------------------

## 8. Custom component library

Build a consistent set of reusable components using React Native
primitives and NativeWind classes.

At minimum, implement:

-   `AppText`
-   `AppButton`
-   `IconButton`
-   `TextField`
-   `PasswordField`
-   `SearchField`
-   `IdeaCard`
-   `FeaturedIdeaCard`
-   `VoteButton`
-   `RatingBadge`
-   `ScoreRing` or equivalent score visualization
-   `CategoryChip`
-   `SectionHeader`
-   `Avatar`
-   `StatCard`
-   `BottomNavigation`
-   `CustomBottomSheet`
-   `Toast`
-   `LoadingIndicator`
-   `Skeleton`
-   `EmptyState`
-   `ErrorState`
-   `ConfirmationDialog`

Requirements: - Components should accept typed props. - Use design
tokens rather than scattered hardcoded values. - Provide variants for
primary/secondary/outlined/destructive actions. - Provide disabled,
loading, focused, selected, and error states where relevant. - Avoid
duplicated styles across screens. - Keep component APIs simple and
consistent.

Do not create a generic abstraction for every tiny element. Reuse
components where it improves consistency.

------------------------------------------------------------------------

## 9. Interaction and quality requirements

Implement real interactions, not static mockups.

Required states: - Initial loading. - Pull to refresh where
appropriate. - Skeleton loading. - Empty feed. - Empty personal ideas. -
Search with no results. - Form validation errors. - API errors with
retry. - Successful submission. - Evaluation in progress. -
Already-voted state. - Vote success/failure. - Profile loading. -
Signed-out / expired session. - Theme switching. - Confirmation before
destructive actions.

Additional quality: - Keyboard-aware forms. - Safe-area handling. -
Scroll behavior that works on small screens. - No clipped text or
overlapping bottom navigation. - Proper image fallbacks and avatar
initials. - Accessible labels for icon-only buttons. - Avoid tiny touch
targets. - Avoid unnecessary animation. - Use `FlatList` or another
appropriate virtualized list for long feeds. - Handle offline/network
failure gracefully with clear feedback. Do not silently pretend a write
succeeded.

### Sharing

Implement share functionality using the platform share sheet or
clipboard through a suitable Expo-supported API. The shared content
should include the idea name, tagline, score, and a link only if a real
shareable URL exists. Do not invent public URLs.

### Notifications

Use in-app toast feedback for submission, voting, profile updates, and
errors. Do not implement push notifications unless they are fully
configured and necessary.

------------------------------------------------------------------------

## 10. Data integrity and business rules

-   A signed-in user can submit multiple ideas.
-   A user can upvote an idea at most once.
-   The idea author should not be allowed to manipulate vote counts.
-   Vote counts are computed from persisted votes.
-   Users can edit or delete only their own ideas.
-   AI evaluation is generated once per submission and stored.
-   Leaderboard values are computed from persisted data.
-   Profile statistics are computed from database records.
-   Sorting must work on real backend data.
-   All write operations require authentication.
-   All ownership checks happen on the backend.
-   Database constraints must enforce important invariants even if the
    client is modified.

If a user edits an idea, define and implement a consistent evaluation
policy. Prefer retaining the previous evaluation until the user
explicitly requests a new simulated evaluation, or regenerate it on save
and persist the new result. Make the behavior clear in the UI.

------------------------------------------------------------------------

## 11. Testing

Add meaningful tests appropriate to the existing setup.

At minimum test: - Evaluation score stays within 0--100. - Evaluation
result contains all expected fields. - Input validation. -
One-vote-per-user enforcement. - Unauthorized API requests are
rejected. - Users cannot edit another user's idea. - Leaderboard
sorting. - Profile statistics. - Theme preference persistence where
practical.

Run: - TypeScript type checking. - Linting if configured. - Unit
tests. - Backend tests. - Expo app startup / bundling check.

Fix errors caused by your changes. Do not hide errors by disabling
TypeScript checks or weakening validation.

If a test cannot be run due to missing external credentials or
unavailable services, state that explicitly and provide the exact manual
verification steps.

------------------------------------------------------------------------

## 12. Environment setup and documentation

Create or update:

-   `.env.example`
-   `.gitignore`
-   Database schema and migrations.
-   Seed script.
-   README.
-   Backend setup documentation.
-   API endpoint documentation.

README must explain:

1.  What Pitchboard does.
2.  Main features.
3.  Tech stack.
4.  Architecture: Expo app → authenticated API → Neon.
5.  How Clerk authentication works.
6.  How to create/configure a Clerk application.
7.  How to create a Neon database and obtain its connection string.
8.  Where to place environment variables.
9.  How to run database migrations and seed demo data.
10. How to run the backend.
11. How to run the Expo app on Android and iOS.
12. How to test authentication and voting.
13. Known limitations and any steps requiring external credentials.

Do not include real credentials in README, source files, logs,
screenshots, or commits.

------------------------------------------------------------------------

## 13. Implementation order

Work in this order, but continue through all phases rather than stopping
after each one:

### Phase 1 --- Repository audit

-   Inspect existing Expo project and versions.
-   Confirm NativeWind configuration.
-   Identify existing navigation and source structure.
-   Identify compatibility problems before adding packages.

### Phase 2 --- Design foundation

-   Establish color, typography, spacing, radius, and elevation tokens.
-   Implement light/dark theme provider.
-   Build reusable custom components.
-   Confirm the design looks consistent on Android and iOS.

### Phase 3 --- Backend and database

-   Create Neon schema and migrations.
-   Configure Clerk verification in the backend.
-   Implement user provisioning.
-   Implement ideas, votes, profile, and leaderboard endpoints.
-   Add seed data and validation.

### Phase 4 --- Authentication

-   Implement welcome, sign-up, sign-in, verification, password recovery
    where supported, session persistence, and protected routes.
-   Verify backend requests use the authenticated Clerk session.

### Phase 5 --- Application screens

-   Discover.
-   Submit idea.
-   Evaluation result.
-   Idea details.
-   Leaderboard.
-   My Ideas / Profile.
-   Settings.

### Phase 6 --- Integration

-   Connect all screens to real API data.
-   Implement persistent voting.
-   Implement sorting and filtering.
-   Implement profile updates.
-   Implement theme persistence.
-   Implement sharing and toast feedback.

### Phase 7 --- Verification

-   Run type checking, tests, linting, and app startup.
-   Fix issues.
-   Verify critical user journeys.
-   Update README with exact commands and setup steps.

------------------------------------------------------------------------

## 14. Definition of done

The task is complete only when:

-   [ ] The existing Expo project is used and still starts successfully.
-   [ ] NativeWind is working correctly.
-   [ ] Custom reusable components are used throughout.
-   [ ] Android and iOS use the same visual design.
-   [ ] Light and dark themes work and persist.
-   [ ] Users can sign up and sign in through Clerk.
-   [ ] Authentication sessions persist correctly.
-   [ ] Protected routes work.
-   [ ] User profile data is associated with the Clerk identity.
-   [ ] Neon stores users, ideas, evaluations, and votes.
-   [ ] Neon credentials exist only on the server.
-   [ ] Users can submit ideas.
-   [ ] Simulated AI evaluations are generated and persisted.
-   [ ] Users can browse and sort ideas.
-   [ ] Users can upvote each idea only once.
-   [ ] Leaderboard is calculated from database data.
-   [ ] Users can view and manage their own ideas.
-   [ ] Loading, error, empty, and success states exist.
-   [ ] README and `.env.example` are complete.
-   [ ] Type checking and available tests pass.
-   [ ] No critical buttons or navigation destinations are dead.

------------------------------------------------------------------------

## 15. Final instructions

Be opinionated about design quality, but conservative about architecture
changes.

Prioritize a cohesive, premium mobile experience and reliable
functionality over unnecessary complexity.

Do not stop at a prototype. Build the complete application, integrate
the database and authentication, test the important flows, and document
the remaining external setup requirements.

If credentials are unavailable, do as much implementation as possible
without them. Clearly distinguish implemented functionality from
functionality awaiting configuration.

At the end, provide a concise implementation report containing: - What
you built. - Important files created or modified. - Packages added or
changed. - Database tables and migrations. - API routes. - Environment
variables the developer must configure. - Commands to start the backend
and mobile app. - Tests and checks run, with their actual results. - Any
remaining blockers.

**Start by auditing the existing repository, then implement the
application.**
