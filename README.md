# LaunchDeck

LaunchDeck is a mobile app for sharing startup ideas, getting a structured evaluation, and discovering and voting on ideas from other founders. The app is built with Expo and React Native. Its API is a separate Node.js service backed by Neon PostgreSQL and Clerk authentication.

## Project structure

- `src/` contains the Expo Router app, screens, components, state, and API client.
- `server/` contains the Hono API, database schema and migrations, and seed data.
- `app.json` contains the Expo app configuration.
- `eas.json` contains the cloud build profiles.

## Requirements

- Node.js and npm
- An Expo account for cloud Android builds
- A Clerk application
- A Neon PostgreSQL database

## Configure the app and API

Copy `.env.example` to `.env` and set the Clerk publishable key and API URL:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_API_URL=http://localhost:3000
```

For local development, use `http://localhost:3000` on web or an iOS simulator. For an Android emulator, use `http://10.0.2.2:3000`. For a physical phone on the same Wi-Fi network as your computer, use the computer's local IP address, such as `http://192.168.1.20:3000`.

Create `server/.env` from `server/.env.example` and set the backend values:

```env
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
PORT=3000
```

Keep `.env` files and secret keys out of source control. The Clerk secret key and database URL belong only on the backend. The mobile app's publishable key and API URL are included in the app and should be treated as public values.

## Set up the database

Create a Neon PostgreSQL database and put its connection string in `server/.env` as `DATABASE_URL`. From the project root, install server dependencies and run the migrations:

```sh
npm --prefix server ci
npm --prefix server run db:migrate
```

To add the included sample records, run:

```sh
npm --prefix server run db:seed
```

## Run locally

In one terminal, start the API:

```sh
npm --prefix server run dev
```

The health endpoint should respond at `http://localhost:3000/health`.

In another terminal, install the app dependencies and start Expo:

```sh
npm ci
npx expo start
```

## Deploy the backend to Render

The mobile app needs a public HTTPS URL for the API. If the backend is already deployed, open `https://YOUR-SERVICE.onrender.com/health` and confirm it returns a JSON response with `"status":"ok"`.

For a new Render web service connected to this repository, use these settings:

- Runtime: Node
- Root directory: `server`
- Build command: `npm ci && npm run build`
- Start command: `npm start`

Set these environment variables in the Render service settings:

- `DATABASE_URL`: the Neon connection string
- `CLERK_SECRET_KEY`: the Clerk secret key
- `CLERK_PUBLISHABLE_KEY`: the Clerk publishable key

Render provides the `PORT` value to the service. The API reads this value when it starts. After deployment, copy the service's `https://...onrender.com` URL. Do not add `/health` or a trailing slash to the URL when configuring the app.

## Build an APK for your Android phone

The `preview` profile in `eas.json` is already configured to produce an installable APK. Before building, make sure the Render API is running and set the app's public variables in Expo's EAS project under **Environment variables**, using the **preview** environment:

- `EXPO_PUBLIC_API_URL` = `https://YOUR-SERVICE.onrender.com`
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` = your Clerk publishable key (`pk_...`)

These values are bundled into the APK during the build. Changing them later requires building a new APK. Do not add the Clerk secret key or database connection string to the Expo project; those stay in Render.

From the project root, log in to Expo and start the build:

```sh
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview
```

If EAS asks to configure the project, follow its prompts. When the build finishes, open the build link it prints or the build page on Expo's website, download the `.apk`, and send it to your phone using a cable, cloud storage, or a messaging app. Open the APK on the phone and allow installation from that source if Android asks. Then launch LaunchDeck from the home screen.

The APK is a standalone app; Expo Go is not needed to run it. Your phone needs an internet connection to reach the Render API. Some Render plans may spin down an idle service, so the first API request after a period of inactivity can take longer while the service starts.

## Troubleshooting

- If the app cannot reach the API, check the API URL in the EAS `preview` environment and confirm `/health` works over HTTPS in a phone browser.
- If sign-in fails, confirm the Clerk publishable key in the EAS `preview` environment and the Clerk secret key in Render belong to the same Clerk application.
- If the API starts but requests fail, check the Render logs and confirm the Neon database is reachable and migrations have been run.
- If Android blocks the installation, allow installs from the app you used to open the APK in Android's settings, then open the downloaded APK again.

## Useful commands

```sh
npx expo lint
npx tsc --noEmit
npm --prefix server run build
npm --prefix server test
```
