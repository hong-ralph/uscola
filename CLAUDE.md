# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack TypeScript application with Express.js backend and React frontend. The project uses a monorepo structure with workspaces for organized development.

## Project Structure

```
uscola/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                # React client
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API calls
│   │   ├── types/           # TypeScript types
│   │   ├── styles/          # CSS files
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── shared/                  # Shared types/utils
└── package.json             # Workspace root
```

## Development Commands

### Main Development
```bash
npm run dev                   # Start both backend and frontend
npm run dev:backend           # Start only backend (port 3000)
npm run dev:frontend          # Start only frontend (port 5173)
```

### Building
```bash
npm run build                 # Build both backend and frontend
npm run build:backend         # Build only backend
npm run build:frontend        # Build only frontend
```

### Code Quality
```bash
npm run lint                  # Lint both projects
npm run format                # Format both projects
npm run test                  # Run all tests
npm run test:backend          # Run backend tests only
npm run test:frontend         # Run frontend tests only
```

### Individual Project Commands
```bash
# Backend
cd backend
npm run dev                   # Start with nodemon
npm run build                 # Compile TypeScript
npm run start                 # Run compiled JS
npm run lint                  # ESLint check
npm run test                  # Jest tests
npm run test:watch            # Jest tests in watch mode

# Frontend  
cd frontend
npm run dev                   # Start Vite dev server
npm run build                 # Build for production
npm run preview               # Preview production build
npm run lint                  # ESLint check
npm run test                  # Jest tests
npm run test:watch            # Jest tests in watch mode
```

## Architecture

### Backend (Express + TypeScript)
- **Framework**: Express.js with TypeScript
- **Structure**: Controller → Service → Model pattern
- **Security**: Helmet middleware for security headers
- **Validation**: Joi schemas
- **Error Handling**: Centralized error middleware
- **CORS**: Configured for frontend connection
- **Logging**: Morgan for HTTP request logging
- **Health Check**: `/health` endpoint

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom theme and plugins
- **Routing**: React Router DOM
- **HTTP Client**: Axios with interceptors
- **Testing**: Jest with React Testing Library
- **Dev Server**: Proxy to backend API

### Key Features
- Full TypeScript support with path aliases
- ESLint + Prettier configuration
- Jest testing setup with coverage reporting
- Environment configuration
- CORS-enabled API communication
- Development proxy setup
- Docker containerization for production
- Oracle Cloud deployment ready

## API Structure

Base URL: `http://localhost:3000/api`

Current endpoints:
- `GET /api/test` - API health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Environment Setup

1. Copy environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Install dependencies:
```bash
npm install
```

3. Start development:
```bash
npm run dev
```

## Path Aliases

Both projects use TypeScript path aliases:

**Backend**: `@/*`, `@controllers/*`, `@middleware/*`, `@routes/*`, `@services/*`, `@types/*`, `@utils/*`, `@config/*`

**Frontend**: `@/*`, `@components/*`, `@pages/*`, `@hooks/*`, `@services/*`, `@types/*`, `@utils/*`, `@styles/*`

## Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
cd backend && npm run test:watch
cd frontend && npm run test:watch

# View test coverage
cd backend && npm run test  # Coverage reports in backend/coverage/
cd frontend && npm run test # Coverage reports in frontend/coverage/
```

### Test Configuration
- **Backend**: Jest with ts-jest, coverage reports in HTML and LCOV formats
- **Frontend**: Jest with jsdom environment, React Testing Library setup

## Deployment

### Docker Development
```bash
# Build and run with Docker Compose
docker compose up --build

# Services available at:
# Frontend: http://localhost:80
# Backend: http://localhost:3000
```

### Production Deployment (Oracle Cloud)
The project includes Oracle Cloud deployment configuration:
- Docker-based deployment with nginx reverse proxy
- GitHub Actions workflow for automated deployment
- Complete setup scripts and documentation in `/deploy` folder

## Language Support

Korean language support is maintained throughout the application with UTF-8 encoding.