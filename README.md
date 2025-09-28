# Bengali Voice-to-Text Platform

A secure Bengali voice-to-text workspace built with Next.js 15, React 19, NextAuth, Prisma, and PostgreSQL. Optimized for Bengali (Bangla) speech recognition with support for 40+ languages, providing both real-time browser-based capture and recorded audio transcription powered by Gemini or OpenAI, with dedicated dashboards for end users and administrators.

## Features
- **Bengali-first design** with Bengali (Bangla) as the default language for speech recognition
- **Multi-language support** for 40+ languages including Bengali, English, Hindi, Arabic, and more
- **Role-based access** with NextAuth credentials authentication and Prisma adapter
- **Real-time Bengali transcription** via the browser Speech Recognition API with server-side persistence
- **Recorded audio transcription** that uploads audio files and routes them to Gemini or OpenAI
- **Smart language detection** with automatic fallback to Bengali variants
- **Audit-ready history** stored in PostgreSQL, exposed via secure API routes and admin views
- **Admin console** with usage metrics, user insights, and transcript oversight
- **Tailwind CSS UI** focused on clarity, dark-theme aesthetics, and accessibility

## Tech Stack
- [Next.js 15 (App Router)](https://nextjs.org/)
- [React 19](https://react.dev/)
- [NextAuth.js](https://next-auth.js.org/) with Credentials provider
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [OpenAI Node SDK](https://github.com/openai/openai-node) & [Google Generative AI](https://ai.google.dev/)

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy the example file and update the secrets:
```bash
cp .env.example .env
```
Required variables:
- `DATABASE_URL` – PostgreSQL connection string.
- `NEXTAUTH_SECRET` – random 32+ character secret for JWT encryption.
- `NEXTAUTH_URL` – base URL of the app (e.g. `http://localhost:3000`).
- `OPENAI_API_KEY` / `OPENAI_MODEL` – optional, for OpenAI audio transcription.
- `GEMINI_API_KEY` / `GEMINI_MODEL` – optional, for Gemini transcription.
- `PRIMARY_TRANSCRIPTION_PROVIDER` – default provider (`openai`, `gemini`, or `local`).

Optional (for seeding):
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

### 3. Database & Prisma
Generate the Prisma client and run migrations (requires PostgreSQL running):
```bash
npm run prisma:generate
npm run prisma:migrate
```
Seed demo data (admin + sample transcripts):
```bash
npm run prisma:seed
```

### 4. Start the development server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to access the marketing site, `/sign-in` for the workspace login, and `/dashboard` for the authenticated experience.

## Scripts
| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run interactive Prisma migrations |
| `npm run prisma:seed` | Seed the database with demo data |

## Architecture Overview
- **App Router** pages under `src/app/` with separate routes for marketing, auth, dashboard, and admin.
- **API routes** under `src/app/api/` handling authentication, recorded audio uploads, realtime session storage, and transcript retrieval.
- **Prisma schema** defines users, accounts, sessions, verification tokens, and transcription records with provider metadata.
- **Transcription providers** can be extended in `src/lib/transcription/` to add support for more engines or queues.
- **UI components** in `src/components/` offer reusable building blocks for forms, cards, dashboards, and layout.

## Security Notes
- All authenticated routes and APIs are protected by NextAuth middleware with role-aware checks.
- Admin routes enforce elevated permissions; non-admin users are redirected to the workspace.
- Passwords use bcrypt hashing; update the hashing rounds or integrate external identity providers as needed.
- Ensure HTTPS is enabled in production and rotate the `NEXTAUTH_SECRET` when deploying.

## Roadmap Ideas
- WebSocket streaming to offload realtime transcription to Gemini or OpenAI Realtime APIs.
- Audio storage via object storage (S3, GCS) with signed URLs.
- Multi-tenant organizations with granular permissions.
- Automated QA workflows (summaries, topic detection) on completed transcripts.

---
Crafted with ❤️ to provide a clean, secure voice-to-text experience for teams.
