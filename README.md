# My First API — Rocketseat Edition 🚀

A minimal, typed, and testable REST API built during the Rocketseat "My First API" event. It uses Fastify + TypeScript + Zod for safe I/O, Drizzle ORM for PostgreSQL, and JWT for auth with role-based access control.

Live API: https://my-first-api-rocketseat-event.fly.dev

Note: API docs (/docs) are available only in development mode.


## ✨ Tech Stack
- Fastify 5 + TypeScript
- Zod + fastify-type-provider-zod
- Drizzle ORM + PostgreSQL
- JWT auth (argon2 for password hashing)
- Vitest for tests


## 🧭 Routes Overview
The API is JWT-protected. Some routes require specific roles.

```mermaid
flowchart TD
  A[Client] -->|POST /sessions<br/>anonymous| B[Login<br/>200: token<br/>400: message]

  A -->|POST /enrollments<br/>JWT: any user| C[Create Enrollment<br/>201: enrollmentId<br/>400: Already enrolled]

  A -->|GET /courses<br/>JWT: role=manager| D[List Courses<br/>200: courses, total]
  A -->|POST /courses<br/>JWT: role=manager| E[Create Course<br/>201: courseId]

  A -->|GET /courses/:id<br/>JWT: role=student| F[Get Course<br/>200: course<br/>404: Not found]
```


## 🔐 Authentication & Roles
- Login with POST /sessions → returns JWT.
- Include the token on protected routes using Authorization: Bearer <token>.
- Role checks:
  - manager: required to list/create courses.
  - student: required to read a course by id.
  - any authenticated user: can create enrollments.


## ▶️ Quickstart (Local)
Prerequisites: Node.js 22+, Docker (optional), PostgreSQL instance.

1) Install dependencies
- npm install

2) Configure environment

3) Start PostgreSQL via Docker (optional)
- docker compose up -d

4) Run migrations and seed
- npm run db:migrate
- npm run db:seed

5) Start the API (dev)
- npm run dev
- Docs (dev only): http://localhost:3333/docs


## 🧪 Testing
- Tests run with a dedicated test database using .env.test
- npm test


## 🧰 Useful Commands
- npm run db:migrate → Apply migrations
- npm run db:generate → Generate Drizzle SQL from schema
- npm run db:seed → Seed database with sample data
- docker compose up -d → Start local PostgreSQL


## 🎯 Mission
Keep it simple. Keep it typed. Ship fast. Learn faster. ✨