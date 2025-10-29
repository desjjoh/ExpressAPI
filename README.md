# 🚀 QuickAPI-Express

A modern, production-ready **Express + TypeScript + Prisma (SQLite)** microservice template — containerized with Docker and documented via Swagger.  
Designed for rapid prototyping and internal service development.

---

## ✨ Features

- ⚙️ **TypeScript (ESM)** — strict mode, modern syntax, clean path aliases
- 🧩 **Prisma ORM (SQLite)** — lightweight and schema-driven persistence layer
- 🧾 **Zod Validation** — runtime validation for environment variables and request payloads
- 🧠 **OpenAPI 3.1 (Swagger)** — auto-generated documentation from Zod schemas
- 🔒 **Security Middleware** — Helmet, CORS, compression, and rate limiting out of the box
- 🪵 **Structured Logging** — Pino + pino-http for rich request and system logs
- 💉 **Graceful Shutdown** — clean Prisma disconnects and signal handling (SIGINT/SIGTERM)
- 🐳 **Docker & Compose** — minimal multi-stage build for local or CI/CD deployments

---

## 🧱 Project Structure

```bash
├── src/
│   ├── app.ts                # Express app initialization
│   ├── index.ts              # Entry point, graceful shutdown logic
│   ├── config/               # Zod env validation, Swagger config
│   ├── db/
│   │   ├── prisma.ts         # Prisma client connection
│   │   └── generated/        # Generated Prisma client (after build)
│   ├── logger/               # Pino logger configuration
│   ├── middleware/           # Error handler, validation middleware
│   ├── routes/
│   │   ├── health.ts         # Health/metrics endpoint
│   │   └── users.ts          # CRUD example route
│   └── schemas/              # Zod schemas for validation and OpenAPI
│
├── prisma/
│   └── schema.prisma         # Prisma schema (SQLite)
│
├── Dockerfile
├── docker-compose.yaml
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🧩 Setup

### 1. Install dependencies

```bash
npm ci
```

### 2. Environment setup

Create a `.env` file in the project root:

```bash
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
DATABASE_URL="file:./dev.db"
```

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. Run locally

```bash
npm run dev
```

### 5. Build and start

```bash
npm run build
npm run start
```

---

## 🐳 Docker

### Build & run with Docker Compose

```bash
npm run docker:up
```

Accessible at:

- API → [http://localhost:3000](http://localhost:3000)
- Swagger Docs → [http://localhost:3000/docs](http://localhost:3000/docs)

### Stop containers

```bash
npm run docker:down
```

---

## 🧠 API Overview

| Method | Endpoint      | Description            |
| ------ | ------------- | ---------------------- |
| GET    | `/health`     | Service health check   |
| GET    | `/users`      | List all users         |
| GET    | `/users/{id}` | Retrieve a single user |
| POST   | `/users`      | Create new user        |
| PUT    | `/users/{id}` | Update user            |
| DELETE | `/users/{id}` | Delete user            |

All routes are automatically documented in Swagger using **Zod-to-OpenAPI**.

---

## 🧹 Scripts

| Command               | Description                  |
| --------------------- | ---------------------------- |
| `npm run dev`         | Start in watch mode          |
| `npm run build`       | Compile TypeScript           |
| `npm run start`       | Run compiled app             |
| `npm run docker:up`   | Build and start containers   |
| `npm run docker:down` | Stop containers              |
| `npm run lint`        | Run ESLint + Prettier checks |

---

## 📄 License

MIT © 2025 Your Name  
You’re free to use, modify, and distribute this project with attribution.

---

> _QuickAPI-Express is part of the “QuickAPI” family — a series of small, self-contained microservice templates across modern frameworks (Express, NestJS, FastAPI, etc.)._
