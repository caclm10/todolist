# Todo List App

A modern, full-stack Todo List application built with Next.js, featuring a clean UI and robust task management capabilities.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [SQLite (LibSQL)](https://turso.tech/libsql) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Deployment**: Docker & Docker Compose

## 🛠 Prerequisites

- Node.js 22+ (for local development)
- Docker & Docker Compose (for production deployment)

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd todolist
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Copy `.env.example` to `.env` and fill in the values.
   ```bash
   cp .env.example .env
   ```
   *Note: For local dev, change `DATABASE_URL` to `file:./data/database.sqlite` and ensure the `data` folder exists.*

4. **Prepare the database**:
   ```bash
   mkdir -p data
   npx drizzle-kit generate
   node db/migrate.mjs
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🐳 Docker Deployment

1. **Build the image**:
   ```bash
   docker build -t todolist-app .
   ```

2. **Prepare the host directory**:
   Docker containers run as a non-root user (UID 1001) for security. You must set the correct permissions for the database volume on your host:
   ```bash
   mkdir -p data
   sudo chown -R 1001:65533 data
   ```

3. **Run with Docker Compose**:
   ```bash
   docker-compose up -d
   ```
   The app will be accessible at [http://localhost:8200](http://localhost:8200).

## 🗄 Database Migrations

This project uses Drizzle ORM for database management.

- **Generate migrations**: Run `npx drizzle-kit generate` after modifying `db/schema.ts`.
- **Apply migrations**: Migrations are automatically applied when the Docker container starts via `db/migrate.mjs`.

## ⚙️ Environment Variables

| Variable | Description | Default/Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | SQLite connection string | `file:/app/data/database.sqlite` |
| `BETTER_AUTH_SECRET` | Secret for authentication | Generate with `openssl rand -hex 32` |
| `NEXT_PUBLIC_APP_URL` | Public URL of the app | `http://localhost:3000` |
| `BETTER_AUTH_URL` | Internal URL for Better Auth | `http://localhost:3000` |
