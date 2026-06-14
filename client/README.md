# Trash2Cash Client

React + Vite + Tailwind frontend for the Trash2Cash (T2C) recycling platform.

## Setup

```bash
cd client
npm install
npm run dev
```

Runs at **http://localhost:5173** and proxies API requests to the backend at `http://localhost:3000`.

## Backend

Start the server first (from `server/`):

```bash
npm install
npm start   # or node server.js
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — T2C branding, features, how it works |
| `/register` | User registration with address |
| `/login` | Login → JWT stored in localStorage |
| `/dashboard` | Impact stats, TrashCoins estimate, quick actions |
| `/schedule` | Create pickup (waste types, photos, notes) |
| `/history` | Pickup history with 3-minute cancel window |
| `/profile` | Update user profile and pickup address |

## API Integration

All routes under `/api/v1`:

- `POST /users/` — register
- `POST /users/login` — login
- `GET /users/me` — current user
- `PATCH /users/me` — update profile
- `POST /pickups/` — create pickup (multipart)
- `GET /pickups/` — pickup history
- `DELETE /pickups/:pickupId` — cancel pickup (within 3 min)
