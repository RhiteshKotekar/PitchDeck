# Backend deployment

The mobile app calls the API directly, so deploy the backend as a public HTTPS web service and use its base URL in the mobile app configuration.

## Render settings

For a Render web service connected to this repository, configure:

- Runtime: Node
- Root directory: `server`
- Build command: `npm ci && npm run build`
- Start command: `npm start`

Set these Render environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `CLERK_SECRET_KEY`: Clerk secret key
- `CLERK_PUBLISHABLE_KEY`: Clerk publishable key

Render supplies `PORT`. The server listens on that port. Once deployed, test `https://YOUR-SERVICE.onrender.com/health`; it should return a JSON status response.

## Database migrations

Run migrations against the target database before the app uses it:

```sh
npm --prefix server run db:migrate
```

For production, configure the command to use the production `DATABASE_URL` securely. Do not place the connection string in source control or in the mobile app. The migration command should complete before users access a newly deployed schema.

For future schema changes, update `server/src/db/schema.ts`, generate a migration, review the SQL, and commit both the schema and migration:

```sh
npm --prefix server run db:generate
```

## Mobile client configuration

Set `EXPO_PUBLIC_API_URL` to the API origin, with no `/health` path and no trailing slash. Set `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to the publishable key for the same Clerk instance configured on the backend. These are client values and are included in the app bundle. Rebuild or republish the client after changing them.

Keep `CLERK_SECRET_KEY` and `DATABASE_URL` exclusively in Render's environment settings. Never include them in an Expo variable or client build.
