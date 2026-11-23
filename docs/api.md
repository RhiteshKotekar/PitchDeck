# API reference

The API is served from the backend origin. For local development, that is `http://localhost:3000`. Authenticated routes require `Authorization: Bearer <Clerk session token>`.

JSON responses generally wrap a resource or collection in `data`. Errors use an `error` or `message` field and an appropriate HTTP status. `GET /health` is a simple service check and does not use the `data` wrapper.

## Health

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| GET | `/health` | None | Returns service status and timestamp. |

## Ideas

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| GET | `/api/ideas` | Optional | List ideas. Accepts `page`, `pageSize` (maximum 50), `sort`, `category`, and `search`. Sort values include `newest`, `oldest`, `highest_rated`, `most_voted`, and `trending`. Returns pagination metadata. |
| POST | `/api/ideas` | Required | Create an idea and generate its evaluation. |
| GET | `/api/ideas/:id` | Optional | Get an idea and its vote information. |
| PATCH | `/api/ideas/:id` | Required, author only | Update an idea and refresh its evaluation. |
| DELETE | `/api/ideas/:id` | Required, author only | Delete an idea. |
| POST | `/api/ideas/:id/vote` | Required | Vote for an idea. |
| DELETE | `/api/ideas/:id/vote` | Required | Remove the current user's vote. |

Create and update idea bodies use these fields: `name`, `tagline`, `description`, and `category`. Creation requires all four; updates accept the fields being changed.

Example list request:

```http
GET /api/ideas?page=1&pageSize=10&sort=newest&category=Technology
```

## Leaderboard

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| GET | `/api/leaderboard` | None | Returns ranked ideas. `period` is `all` or `week`; `mode` is `most_voted` or `highest_rated`. |

## Users and profile

| Method | Path | Authentication | Description |
| --- | --- | --- | --- |
| GET | `/api/me` | Required | Get the current user's profile. |
| PATCH | `/api/me` | Required | Update the current user's profile. Supported fields: `displayName`, `username`, `email`, `avatarUrl`, and `bio`. |
| GET | `/api/users/me/ideas` | Required | List the current user's ideas. |
| GET | `/api/users/me/stats` | Required | Return idea count, votes received, and average score. |
