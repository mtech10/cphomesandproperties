# Realtor Partner Registration & Referral Tracker (MERN)

A simple sign-up form for realtors, with an automatic referral system underneath:
every realtor gets their own personal link (ending in their username). Anyone
who signs up through that link is tracked in the database as having been
referred by them.

```
your-domain.com/register/janedoe   -->  anyone signing up here is linked to "janedoe"
```

## Stack
- **MongoDB** + **Mongoose** — stores realtors and referral relationships
- **Express** + **Node.js** — REST API
- **React** (Vite) — the registration form, success page, and internal dashboard

## Project structure

```
realtor-referral-app/
├── server/              Express + MongoDB API
│   ├── config/db.js
│   ├── models/Realtor.js
│   ├── controllers/realtorController.js
│   ├── routes/realtorRoutes.js
│   ├── middleware/adminAuth.js
│   ├── server.js
│   └── .env.example
└── client/              React frontend (Vite)
    ├── src/
    │   ├── pages/RegisterPage.jsx
    │   ├── pages/SuccessPage.jsx
    │   ├── pages/Dashboard.jsx
    │   ├── components/Navbar.jsx
    │   ├── api.js
    │   ├── App.jsx
    │   └── index.css
    └── .env.example
```

## How the referral logic works

1. A realtor registers at the plain root URL (`/`) — this is a **direct sign-up**,
   no `referredBy` is set.
2. After registering, they land on a success page showing their personal link:
   `https://yourdomain.com/register/<their-username>`.
3. When someone else opens that link and registers, the frontend sends the
   `username` from the URL along as `referralUsername` in the registration
   request.
4. The backend looks up the realtor with that username and sets the new
   realtor's `referredBy` field to that realtor's MongoDB `_id`.
5. The `/api/realtors` (dashboard) endpoint returns everyone along with who
   referred them and how many people they've referred, computed with a
   Mongo aggregation.

If a referral link uses a username that doesn't exist, the person can still
register — they're just recorded as a direct sign-up instead of the request
being blocked.

## Getting started

### 1. Prerequisites
- Node.js 18+
- A MongoDB database — either running locally, or a free cluster on
  [MongoDB Atlas](https://www.mongodb.com/atlas)

### 2. Backend setup

```bash
cd server
cp .env.example .env
# edit .env: set MONGO_URI to your database, and pick your own ADMIN_KEY
npm install
npm run dev        # starts on http://localhost:5000
```

### 3. Frontend setup

Open a second terminal:

```bash
cd client
npm install
npm run dev         # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`
automatically (see `client/vite.config.js`), so you don't need to configure
anything else for local development.

Visit **http://localhost:5173** to see the registration form.

### 4. Try the referral flow
1. Register your first realtor at `http://localhost:5173/`.
2. On the success page, copy the personal link shown (something like
   `http://localhost:5173/register/janedoe`).
3. Open that link in a new incognito window and register a second realtor.
4. Go to `http://localhost:5173/dashboard`, enter the `ADMIN_KEY` you set in
   `server/.env`, and you'll see the second realtor listed with "Referred by:
   Jane Doe (@janedoe)", and Jane's referral count showing `1`.

## API reference

| Method | Endpoint                              | Access        | Description |
|--------|----------------------------------------|---------------|--------------|
| POST   | `/api/realtors/register`               | Public        | Create a new realtor, optionally passing `referralUsername` |
| GET    | `/api/realtors/lookup/:username`       | Public        | Check whether a referral link/username is valid |
| GET    | `/api/realtors/:username/referrals`    | Public        | List everyone a specific realtor has referred |
| GET    | `/api/realtors`                        | Requires `x-admin-key` header | Full list of realtors with referral counts (dashboard) |

## Deploying

- **Backend**: deploy `server/` to any Node host (Render, Railway, Fly.io, etc.)
  and set `MONGO_URI`, `PORT`, `ADMIN_KEY` as environment variables there.
- **Frontend**: run `npm run build` inside `client/`, which outputs a static
  `dist/` folder you can deploy to Vercel, Netlify, or any static host. Set
  `VITE_API_URL` to your deployed backend's URL (e.g.
  `https://api.yourdomain.com/api`) before building.
- Make sure your production React router is configured so that
  `/register/:username` and `/dashboard` are served by the same `index.html`
  (a standard SPA rewrite rule — most static hosts have a one-line setting
  for this).

## Notes on the admin key

The `/dashboard` page and its underlying `GET /api/realtors` endpoint are
protected by a shared secret (`ADMIN_KEY` in `server/.env`), not full user
login — enough to keep the realtor list from being public, without adding
a login system. If you later want per-realtor logins, the `password` field
on each realtor is already hashed and ready to plug into an authentication
flow (e.g. with JSON Web Tokens).
