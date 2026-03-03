# gym-backend

Node.js + Express + Supabase backend for a Gym/Fitness mobile app.

## 1) Setup

```bash
cd gym-backend
npm install
cp .env.example .env
```

Update `.env` with your Supabase project values.

## 2) Run

```bash
npm start
```

Server runs at:

- `http://localhost:5000`

## 3) API Endpoints

### AUTH
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /auth/profile` (protected)

### WORKOUTS
- `GET /workouts`
- `GET /workouts/:id`
- `POST /workouts` (protected)
- `PUT /workouts/:id` (protected)
- `DELETE /workouts/:id` (protected)

### PROGRESS
- `POST /progress` (protected)
- `GET /progress/:userId` (protected)

## Auth header for protected routes

```http
Authorization: Bearer <SUPABASE_ACCESS_TOKEN>
```

