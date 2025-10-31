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
  A[Client] -->|POST /sessions\n(anonymous)| B[Login → 200 { token }\n400 { message }]

  A -->|POST /enrollments\n(JWT: any user)| C[Create Enrollment → 201 { enrollmentId }\n400 Already enrolled]

  A -->|GET /courses\n(JWT: role=manager)| D[List Courses → 200 { courses, total }]
  A -->|POST /courses\n(JWT: role=manager)| E[Create Course → 201 { courseId }]

  A -->|GET /courses/:id\n(JWT: role=student)| F[Get Course → 200 { course }\n404 Not found]
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
- cp .example.env .env
- Set DATABASE_URL and JWT_SECRET. Example for the included docker-compose:
  - DATABASE_URL=postgres://admin:admin@localhost:5432/desafio

3) Start PostgreSQL via Docker (optional)
- docker compose up -d

4) Run migrations and seed (optional but helpful)
- npm run db:migrate
- npm run db:seed
  - Seeds create student users with password 1234567 and random emails.

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


## 🧪 Try It (curl)
Login and grab the token:

- curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"YOUR_EMAIL","password":"1234567"}' \
  https://my-first-api-rocketseat-event.fly.dev/sessions

Use the token on protected routes:

- export TOKEN=your.jwt.token

Create enrollment (any authenticated user):

- curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId":"<uuid>"}' \
  https://my-first-api-rocketseat-event.fly.dev/enrollments

List courses (role=manager):

- curl -H "Authorization: Bearer $TOKEN" \
  "https://my-first-api-rocketseat-event.fly.dev/courses?search=&orderBy=title&page=1"

Create course (role=manager):

- curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Node.js Basics","description":"Intro to Node"}' \
  https://my-first-api-rocketseat-event.fly.dev/courses

Get course by id (role=student):

- curl -H "Authorization: Bearer $TOKEN" \
  https://my-first-api-rocketseat-event.fly.dev/courses/<uuid>


## 👩‍🏫 Making a Manager (for local testing)
The seed creates only students. To promote a user to manager, run in your database:

- UPDATE users SET role = 'manager' WHERE email = 'user@example.com';

Then log in with that email and use the returned token to access manager routes.


## 📦 Project Hints
- Development-only docs are served via /docs with a custom theme.
- There is a requisições.http file for REST Client users (VS Code) to try requests.


## 🎯 Mission
Keep it simple. Keep it typed. Ship fast. Learn faster. ✨