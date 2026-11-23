# Getting started

## Requirements

- Node.js and npm
- A Clerk application for authentication
- A PostgreSQL database (Neon is used by the hosted project)

Install dependencies from the repository root:

```sh
npm ci
npm --prefix server ci
```

## Configure the mobile app

Copy `.env.example` to `.env` and set the Clerk publishable key and API base URL:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_API_URL=http://localhost:3000
```

The API URL depends on where the app runs:

- Web or iOS simulator: `http://localhost:3000`
- Android emulator: `http://10.0.2.2:3000`
- Physical device on the same network: use the computer's local IP, for example `http://192.168.1.20:3000`

## Configure the API

Copy `server/.env.example` to `server/.env` and set:

```env
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
PORT=3000
```

Create a Clerk application and use keys from the same Clerk instance in the client and server. The publishable key is used by the mobile client; the secret key and database URL must remain on the server. Do not commit real environment files or credentials.

Create a PostgreSQL database, set `DATABASE_URL`, then apply the checked-in migrations:

```sh
npm --prefix server run db:migrate
```

To load the sample ideas and votes into a development database:

```sh
npm --prefix server run db:seed
```

## Start development servers

Start the API in one terminal:

```sh
npm --prefix server run dev
```

Check that `http://localhost:3000/health` returns a JSON response with `"status":"ok"`.

Start Expo from the repository root in another terminal:

```sh
npx expo start
```

Open the app in a simulator or scan the development QR code with a compatible Expo development client. The project includes native modules, so Expo Go may not include everything required by this app.
