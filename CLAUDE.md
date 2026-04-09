# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack TypeScript monorepo (npm workspaces): Express.js backend + React frontend + shared types. Korean language UI with UTF-8 encoding.

## Development Commands

```bash
# Development
npm run dev                   # Start both backend (port 3000) and frontend (port 5173)
npm run dev:backend           # Backend only (nodemon + tsx)
npm run dev:frontend          # Frontend only (Vite)

# Build
npm run build                 # Build both
npm run build:backend         # TypeScript → dist/
npm run build:frontend        # Vite production build

# Code Quality
npm run lint                  # ESLint both projects
npm run format                # Prettier both projects

# Tests
npm run test                  # All tests (backend includes coverage)
npm run test:backend          # Backend Jest tests with coverage
npm run test:frontend         # Frontend Jest tests
cd backend && npm run test:watch   # Watch mode
cd frontend && npm run test:watch  # Watch mode

# Docker
docker compose up --build     # Frontend: localhost:80, Backend: localhost:3000
```

## Architecture

### Backend (`backend/`) — Express + TypeScript
- **Pattern**: Controller → Service (in-memory mock data, ready for DB integration)
- **Middleware stack** (in `app.ts`): Helmet → CORS → Morgan → body parsing → routes → notFound → errorHandler
- **Validation**: Joi schemas in `utils/validation.ts`
- **Health check**: `GET /health` returns status + timestamp
- **Entry point**: `server.ts` (graceful shutdown handling)
- **Module system**: CommonJS (target ES2020)

### Frontend (`frontend/`) — React 18 + Vite + Tailwind CSS
- **Routing**: React Router v6 (`/` → Home, `/users` → Users)
- **API client**: Axios instance in `services/api.ts` with Bearer token interceptor and 401 handling
- **Dev proxy**: Vite proxies `/api` → `http://localhost:3000`
- **Styling**: Tailwind CSS with `@tailwindcss/forms` and `@tailwindcss/typography` plugins
- **Module system**: ESNext

### Shared (`shared/`) — Common TypeScript types
- `User`, `CreateUserRequest`, `UpdateUserRequest` interfaces
- Note: Frontend has its own extended User types (with `createdAt`, `updatedAt`, `ApiResponse`)

## API Endpoints

Base: `http://localhost:3000/api`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/test` | API health check |
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create user (Joi validated) |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

## Path Aliases

Both projects use `@/` aliases mapped in tsconfig, Vite config, and Jest config:

- **Backend**: `@/*`, `@controllers/*`, `@middleware/*`, `@models/*`, `@routes/*`, `@services/*`, `@types/*`, `@utils/*`, `@config/*`
- **Frontend**: `@/*`, `@components/*`, `@pages/*`, `@hooks/*`, `@services/*`, `@types/*`, `@utils/*`, `@styles/*`

## Code Style

Prettier config (`.prettierrc`): no semicolons, single quotes, trailing commas (es5), 80 char width, LF line endings.

## Testing

- **Backend**: Jest + ts-jest, node environment, coverage in `backend/coverage/`
- **Frontend**: Jest + ts-jest, jsdom environment, React Testing Library, coverage in `frontend/coverage/`
- Test file patterns: `**/__tests__/**/*` and `**/*.{test,spec}.{ts,tsx}`

## CI/CD

- **CI** (`.github/workflows/ci.yml`): Lint → type check → test → build on Node 18.x/20.x matrix, plus npm audit
- **Docker** (`.github/workflows/docker.yml`): Multi-platform builds (amd64/arm64) → GHCR → auto-deploy to Oracle Cloud on main push

## Deployment

- Docker multi-stage builds for both backend (Node Alpine) and frontend (Nginx Alpine)
- Nginx reverse proxy: `/api/` → backend, SPA routing with `try_files`, static asset caching, security headers
- Oracle Cloud deployment via SSH + `deploy/deploy.sh`
