# 🧑‍💻 Development Guide

This guide covers day-to-day development tasks, local setup, useful scripts, and troubleshooting.

---

## 🚀 Quick Start

```bash
# 1) Clone and enter repo
git clone https://github.com/Aldore-88/holbertonschool-final_project.git
cd holbertonschool-final_project

# 2) Build dev containers (first time)
pnpm docker:dev:build

# 3) Run DB migrations + seed sample data
pnpm docker:setup

# 4) Start in background
pnpm docker:dev:bg
```

Services:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health: http://localhost:3001/api/health

---

## 🔐 Environment Setup

Create `.env` files under both apps:
- `apps/frontend/.env`
- `apps/backend/.env`

See `.env.example` files (if present) for required variables. Key values include:
- Auth0: domain, client ID, audience
- Database connection string
- Stripe API keys
- Email service credentials

---

## 🧰 Useful Root Scripts

From the repository root (`package.json`):

```bash
# Compose (dev) build and run
pnpm docker:dev:build           # up --build (interactive)
pnpm docker:dev                 # up (interactive)
pnpm docker:dev:bg              # up -d (background)
pnpm docker:stop                # down (dev compose files)
pnpm docker:clean               # remove containers + volumes
pnpm docker:clean-project       # remove images + volumes

# Database lifecycle via backend container
pnpm docker:setup               # migrate deploy + seed
pnpm docker:seed                # seed only

# Logs and restarts
pnpm docker:logs                # tail all service logs (-f)
pnpm docker:restart-frontend
pnpm docker:restart-backend
```

Common service logs:
```bash
docker logs -f flora-frontend
docker logs -f flora-backend
```

---

## 🗃️ Database Tasks (backend)

Run inside the backend container (or via `docker exec flora-backend ...`):

```bash
# Prisma
pnpm db:migrate      # migrate dev
pnpm db:push         # push schema (non-migration)
pnpm db:generate     # regenerate Prisma client
pnpm db:seed         # seed data
pnpm db:reset        # reset database
```

For initial setup in Docker, prefer the root script:
```bash
pnpm docker:setup
```

---

## 🧪 Testing

Quick commands (run with containers up):
```bash
docker exec flora-backend pnpm test            # all tests
docker exec flora-backend pnpm test:watch      # watch mode
docker exec flora-backend pnpm test:coverage   # coverage

# Suites
docker exec flora-backend pnpm test:auth
docker exec flora-backend pnpm test:order
docker exec flora-backend pnpm test:payment
docker exec flora-backend pnpm test:email
docker exec flora-backend pnpm test:ai
docker exec flora-backend pnpm test:integration
```

See the full guide: `docs/TESTING_CI/CD_GUIDE.md`.

---

## 🧱 Frontend Tasks

Inside the frontend container (or `docker exec flora-frontend ...`):
```bash
pnpm dev                 # local dev server (port 5173)
pnpm build               # development build
pnpm build:prod          # strict production build (fails on warnings)
pnpm type-check          # TypeScript project references check
pnpm lint                # run eslint
```

---

## 🧯 Troubleshooting

- Containers stuck or out-of-sync:
  ```bash
  pnpm docker:stop && pnpm docker:dev:bg
  # or
  pnpm docker:clean && pnpm docker:dev:build && pnpm docker:setup
  ```

- Backend DB not migrated/seeded:
  ```bash
  pnpm docker:setup
  ```

- No products returned (empty pages):
  ```bash
  docker exec flora-backend pnpm db:seed
  ```

---

## 📚 Related Docs

- Docker details: `docs/DOCKER_GUIDE.md`
- Database guide: `docs/DATABASE.md`
- Testing + CI/CD: `docs/TESTING_CI/CD_GUIDE.md`
- Project overview: `README.md`

