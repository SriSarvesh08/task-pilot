# TaskPilot

A full-stack Task Management System built with Next.js and NestJS.

## Technology Stack

| Layer    | Technology                  |
|----------|-----------------------------|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend  | NestJS, TypeScript          |
| Database | PostgreSQL (via TypeORM)    |
| API      | REST                        |

## Project Structure

```
TaskPilot/
├── frontend/             # Next.js frontend application
│   ├── app/              # App Router pages
│   ├── components/       # Reusable UI components
│   ├── features/         # Feature-based modules
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities (API client, helpers)
│   ├── types/            # TypeScript type definitions
│   └── public/           # Static assets
├── backend/              # NestJS backend application
│   └── src/
│       ├── modules/      # Feature modules
│       │   └── health/   # Health check endpoint
│       ├── common/       # Shared utilities, guards, pipes
│       ├── config/       # Configuration (database, etc.)
│       └── main.ts       # Application entry point
└── README.md
```

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **PostgreSQL** >= 14 (optional for Phase 1)

## Environment Setup

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
```

**Environment variables:**

| Variable       | Description                  | Default                                          |
|----------------|------------------------------|--------------------------------------------------|
| `PORT`         | Server port                  | `3001`                                           |
| `NODE_ENV`     | Environment                  | `development`                                    |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/taskpilot` |
| `CORS_ORIGIN`  | Allowed CORS origin          | `http://localhost:3000`                           |

### Frontend

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local if your backend runs on a different URL
```

**Environment variables:**

| Variable              | Description      | Default                 |
|-----------------------|------------------|-------------------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL  | `http://localhost:3001`  |

## Running the Project

### Backend

```bash
cd backend
npm install
npm run start:dev
```

The API server starts at **http://localhost:3001**.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at **http://localhost:3000**.

## Health Check Endpoint

Once the backend is running, verify it with:

```
GET http://localhost:3001/api/health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-08-13T12:00:00.000Z",
  "service": "taskpilot-api"
}
```

## Current Implementation Status

### ✅ Completed (Phase 1)

- Project structure (frontend + backend)
- Next.js with App Router, TypeScript, Tailwind CSS, ESLint
- NestJS with TypeScript, modular architecture
- PostgreSQL configuration via environment variables
- Health check endpoint (`GET /api/health`)
- Frontend API client with configurable base URL
- Environment variable configuration
- CORS setup

### 🔲 Upcoming

- Guest login / Authentication
- Task management (CRUD)
- Project management (CRUD)
- Task details and filters
- Theme switching
- Responsive UI
- Production deployment
