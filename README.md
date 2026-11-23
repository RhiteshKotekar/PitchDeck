# LaunchDeck

LaunchDeck is an Expo and React Native app for sharing and discovering startup ideas. Users can publish an idea, receive a structured evaluation, browse and vote on other ideas, and view a leaderboard.

The app includes a mobile client in `src/` and a Hono API in `server/`. The API stores data in PostgreSQL and uses Clerk for authentication. Idea evaluations are generated deterministically by the backend; no external AI service is called.

## Run locally

You need Node.js, npm, a Clerk application, and a PostgreSQL database. Follow the [getting started guide](docs/getting-started.md) to configure the environment and database.

Install dependencies from the repository root:

```sh
npm ci
npm --prefix server ci
```

Start each service in its own terminal:

```sh
npm --prefix server run dev
```

```sh
npx expo start
```

## Documentation

- [Getting started](docs/getting-started.md)
- [Architecture](docs/architecture.md)
- [API reference](docs/api.md)
- [Backend deployment](docs/deployment.md)
- [Contributing](docs/contributing.md)
