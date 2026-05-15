# 🎓 SFL Tournament 2026 - Educational Platform

> **⚠️ Important Notice**
>
> This platform is currently in an **unfinished state** and does not fully reflect our original vision for the project. During the development period, our team was simultaneously working on another high-priority project - a [college website](https://www.figma.com/design/5W3FCfR3rteSeHeO9Wgx1e/%D0%BE%D1%81%D0%B2%D1%96%D1%82%D0%BD%D1%8F-%D0%BF%D0%BB%D0%B0%D1%82%D1%84%D0%BE%D1%80%D0%BC%D0%B0?node-id=0-1&t=ELJ5YDHgqmCTUmV6-0) - which significantly impacted the time and resources available for this one. We appreciate your understanding and patience.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Design (Figma)](#-design-figma)
- [Tech Stack](#-tech-stack)
- [Database](#-database)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Core Features](#-core-features)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Running with Docker](#running-with-docker-recommended)
  - [Local Development](#local-development-without-docker)
- [Environment Variables](#-environment-variables)
- [Database Management](#-database-management)
- [Available Scripts](#-available-scripts)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Branches](#-branches)

---

## 📌 Project Overview

**SFL Tournament 2026** is a web-based educational platform built for *Star for Life Ukraine*. It combines a **tournament management system** with an **online learning platform**, allowing student teams to compete in technology challenges while also accessing educational courses.

The platform supports the full tournament lifecycle - from team registration and task submission to jury evaluation and leaderboard results - alongside a structured course catalog with module-based lessons and progress tracking.

---

## 🎨 Design (Figma)

The full UI/UX design for this platform is available in Figma:

🔗 [**View Figma Design →**](https://www.figma.com/design/5W3FCfR3rteSeHeO9Wgx1e/%D0%BE%D1%81%D0%B2%D1%96%D1%82%D0%BD%D1%8F-%D0%BF%D0%BB%D0%B0%D1%82%D1%84%D0%BE%D1%80%D0%BC%D0%B0?node-id=0-1&t=ELJ5YDHgqmCTUmV6-0)

> Note: The implemented UI may differ from the Figma mockups due to the time constraints described above.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [SvelteKit](https://kit.svelte.dev/) v2 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v3 |
| **ORM** | [Prisma](https://www.prisma.io/) v5 |
| **Authentication** | [Better Auth](https://www.better-auth.com/) v1 |
| **Validation** | [Zod](https://zod.dev/) v4 |
| **Icons** | Lucide Svelte |
| **Build Tool** | Vite 6 |
| **Testing (Unit)** | Vitest |
| **Testing (E2E)** | Playwright |
| **Linting** | ESLint + Prettier |
| **Git Hooks** | Husky + lint-staged |
| **Containerization** | Docker + Docker Compose |

---

## 🗄 Database

| | |
|---|---|
| **Engine** | PostgreSQL 15 |
| **Cache** | Redis 7 |
| **ORM** | Prisma (with migrations) |

The database schema is managed via Prisma Migrate. All migrations are located in `prisma/migrations/`.

### Key Models

| Model | Description |
|---|---|
| `User` | Platform users with role-based access |
| `Tournament` | Tournament events with lifecycle statuses |
| `Team` | Participating teams linked to tournaments |
| `TeamMember` | Members within a team |
| `Task` | Tournament tasks/challenges |
| `Submission` | Team submissions for tasks |
| `JuryAssignment` | Jury-to-submission assignments |
| `Score` | Detailed evaluation scores per submission |
| `Juror` | Dedicated jury member model (legacy/parallel) |
| `Work` | Works submitted for jury review |
| `Assignment` | Jury-work assignments with evaluation state |
| `Evaluation` | Detailed jury evaluation criteria |
| `Course` | Educational courses |
| `Module` | Course modules |
| `Lesson` | Individual lessons within modules |
| `Enrollment` | User enrollments in courses |
| `LessonProgress` | Per-user lesson progress tracking |
| `TeamInvite` | Invitation system for team members |

---

## 📁 Project Structure

```
education_platform/
├── prisma/
│   ├── migrations/          # Database migration history
│   ├── schema.prisma        # Database schema definition
│   ├── seed.ts              # Main seed script
│   ├── seed-courses.ts      # Course data seeding
│   ├── seed-tournaments.ts  # Tournament data seeding
│   ├── seed-jury.ts         # Jury data seeding
│   └── seed-leaderboard.ts  # Leaderboard data seeding
├── src/
│   ├── app.html             # HTML shell
│   ├── app.css              # Global styles
│   ├── hooks.server.ts      # Server-side hooks
│   ├── lib/
│   │   ├── components/      # Reusable Svelte components
│   │   ├── server/          # Server-only utilities & DB access
│   │   ├── stores/          # Svelte stores (client state)
│   │   ├── types/           # TypeScript type definitions
│   │   ├── auth-client.ts   # Auth client configuration
│   │   └── validation.ts    # Zod validation schemas
│   └── routes/
│       ├── admin/                    # Admin panel
│       │   ├── dashboard/            # Admin overview & statistics
│       │   ├── tournaments/          # Tournament management (list, create, edit)
│       │   ├── courses/              # Course management (list, edit by ID)
│       │   ├── certificates/         # Certificate issuance & management
│       │   └── invite/               # Jury invitation system
│       ├── api/                      # API endpoints
│       │   ├── auth/                 # Authentication API
│       │   ├── admin/                # Admin-only API
│       │   │   ├── invite/           # Jury invite API
│       │   │   └── change-password/  # Admin password change
│       │   ├── courses/              # Courses API (CRUD)
│       │   ├── submissions/          # Submissions API
│       │   ├── teams/                # Teams API
│       │   ├── certificates/         # Certificate API
│       │   ├── upload/               # File & cert-template upload
│       │   └── me/                   # Current user API
│       ├── auth/                     # Login / Register pages
│       ├── calendar/                 # Event calendar
│       ├── courses/                  # Course catalog
│       ├── dashboard/                # User dashboard
│       ├── jury/                     # Jury portal
│       │   ├── login/                # Jury login
│       │   ├── works/                # Works assigned to jury
│       │   ├── account/              # Jury account settings
│       │   └── settings/             # Jury preferences
│       ├── leaderboard/              # Tournament leaderboard
│       ├── learn/                    # Course learning interface
│       ├── my-courses/               # User's enrolled courses
│       ├── my-teams/                 # User's teams
│       ├── profile/                  # User profile
│       ├── team/                     # Team detail pages
│       ├── tourments/                # Tournament listing & detail
│       ├── privacy/                  # Privacy policy
│       └── terms/                    # Terms of service
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI pipeline
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile               # Production Docker image
├── package.json
└── vite.config.js
```

---

## 👥 User Roles

The platform implements a **role-based access control (RBAC)** system with three distinct roles:

### 👤 TEAM (Participant) - Default Role
Assigned automatically upon registration. A participant can:
- Register and manage a personal profile
- Create or join a team for a tournament
- View available tournaments and tasks
- Submit work (GitHub repo, video, demo link) for active tasks
- Browse and enroll in educational courses
- Track lesson progress
- View the leaderboard and calendar

### ⚖️ JURY
Jury members are invited by admins and operate through a dedicated portal (`/jury`). A jury member can:
- Log in via a secure token-based link
- View assigned submissions/works
- Evaluate submissions across multiple criteria:
  - Backend quality
  - Database quality
  - Frontend quality
  - Functionality
  - Stability
  - Usability
- Leave comments on evaluated works
- Save evaluations as drafts before final submission

### 🛡️ ADMIN
Administrators have full platform control. An admin can:
- Access the admin dashboard (`/admin/dashboard`) with platform-wide statistics
- Create, edit, and manage tournaments (`/admin/tournaments`)
- Manage tournament tasks and their lifecycle statuses
- Review and approve/reject team registrations
- Invite jury members to the platform (`/admin/invite`)
- Manage courses - create, publish, edit by ID (`/admin/courses`)
- Issue and manage participant certificates (`/admin/certificates`)
- Upload certificate templates
- Change admin account password
- View all submissions and evaluation results

---

## ✨ Core Features

### 🏆 Tournament System
- Tournament lifecycle: `DRAFT → REGISTRATION → RUNNING → FINISHED`
- Team registration with captain & member management
- Task creation with deadlines and tech stack requirements
- Submission portal (GitHub URL, video URL, live demo)
- Team invitation system with `PENDING / ACCEPTED / DECLINED` statuses

### 📚 Learning Platform
- Course catalog with categories and difficulty levels (`BEGINNER / INTERMEDIATE / ADVANCED`)
- Module & lesson structure with video support
- Lesson progress tracking per user
- Free and paid course support
- Course enrollment system

### 🏅 Jury & Evaluation
- Jury members assigned to specific works via `JuryAssignment`
- Detailed scoring across 6 dimensions
- Draft evaluations before final submission
- Token-based secure jury authentication

### 🎓 Admin Panel
- Dedicated admin dashboard with full platform overview
- Tournament creation wizard and lifecycle management
- Jury invitation via email with secure token links
- Certificate generation and template upload
- Course publishing workflow

### 📊 Leaderboard & Calendar
- Real-time leaderboard based on jury scores
- Event calendar for tournament milestones

### 👤 User Profiles
- Extended profile: first/last name, city, school, phone, Discord
- Avatar upload support
- Personal dashboard with enrolled courses and active teams

---

## 🚀 Getting Started

### Prerequisites

- **Docker** and **Docker Compose** (recommended)
- **Node.js** `>= 20.0.0` and **npm** `>= 10.0.0` (for running without Docker)

---

### Running with Docker (Recommended)

The project is set up to run with Docker Compose, which handles the app, PostgreSQL, and Redis automatically.

**1. Clone the repository**

```bash
git clone https://github.com/your-org/education_platform.git
cd education_platform
```

**2. Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#-environment-variables) below).

**3. Build and start all services**

```bash
docker-compose up --build
```

**4. Run database migrations**

```bash
docker-compose exec app npx prisma migrate deploy
```

**5. (Optional) Seed the database**

```bash
docker-compose exec app npm run db:seed
```

The app will be available at **http://localhost:3000**

> **Services started by Docker Compose:**
> - `app` - SvelteKit application on port `3000`
> - `db` - PostgreSQL 15 on port `5432`
> - `db_test` - PostgreSQL 15 (test DB) on port `5433`
> - `redis` - Redis 7 on port `6379`

---

### Local Development (Without Docker)

> Requires PostgreSQL 15+ and Redis 7+ installed and running locally.

**1. Clone the repository**

```bash
git clone https://github.com/your-org/education_platform.git
cd education_platform
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your local values (see [Environment Variables](#-environment-variables) below).

**4. Run database migrations**

```bash
npm run db:migrate
```

**5. (Optional) Seed the database**

```bash
npm run db:seed
```

**6. Start the development server**

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🔐 Environment Variables

Create a `.env` file in the root directory based on the following template:

```env
# Database
DATABASE_URL="postgresql://sfl_user:sfl_password@localhost:5432/sfl_tournament_2026"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="your-super-secret-key-change-in-production"
BETTER_AUTH_URL="http://localhost:5173"

# Redis (optional, for session caching)
REDIS_URL="redis://localhost:6379"
```

> ⚠️ **Never commit your `.env` file to version control.** It is already listed in `.gitignore`.

---

## 🗃 Database Management

| Command | Description |
|---|---|
| `npm run db:generate` | Generate the Prisma Client |
| `npm run db:migrate` | Create and apply a new migration |
| `npm run db:push` | Push schema changes without migration |
| `npm run db:studio` | Open Prisma Studio (GUI) at `localhost:5555` |
| `npm run db:seed` | Seed the database with initial data |
| `npm run db:reset` | Reset the database (⚠️ destructive) |

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Check code style (Prettier + ESLint) |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format all files with Prettier |
| `npm run check` | Run SvelteKit type checking |

---

## ⚙️ CI/CD Pipeline

The project uses **GitHub Actions** for continuous integration. The pipeline runs on every push to `main` and on all pull requests.

### Pipeline Stages

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐     ┌──────────────┐
│  1. Lint &  │     │  2. Unit Tests  │     │  3. Build    │     │  4. E2E      │
│  Type Check │ ──► │  (Vitest +      │     │  Check       │ ──► │  Tests       │
│             │     │  Coverage)      │     │  (SvelteKit) │     │  (Playwright)│
└─────────────┘     └─────────────────┘     └──────────────┘     └──────────────┘
```

| Step | What it checks |
|---|---|
| **Lint & Type Check** | ESLint, Prettier formatting, Svelte type safety |
| **Unit Tests** | Vitest test suite with V8 coverage |
| **Build** | SvelteKit production build succeeds |
| **E2E Tests** | Full Playwright browser tests against a real DB |

---

## 🌿 Branches

| Branch | Description |
|---|---|
| `main` | The only branch - contains all features including the full admin panel, tournament management, certificate system, and core platform functionality |

---

<div align="center">

Built with ❤️ by the SFL Tournament 2026 Team

</div>