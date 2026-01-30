<p align="center">
  <img src="public/logo.jpeg" alt="English Home" width="96" />
</p>

# English Home

A modern, bilingual (EN/AR) English learning web app built with React, Vite, and TanStack Router. It features locale-aware routing, OTP-based authentication, level/lesson modules, and a clean, accessible UI.

> [!NOTE]
> Routes are localized: the app lives under a locale prefix such as `/en` or `/ar`, with automatic RTL support for Arabic.

## Features

- React 19 + Vite 7 + TypeScript
- File-based routing with TanStack Router v1 and code-splitting
- Data fetching/caching with TanStack Query
- i18next + react-i18next with EN/AR and automatic RTL via Radix DirectionProvider
- Tailwind CSS v4 for styling and a reusable UI component system
- Auth flow with email/password, OTP verification, and optional Google/Facebook entry points
- Axios API client with auth token interceptor
- Tested with Vitest + Testing Library

## Tech stack

- Build tooling: Vite, TypeScript, ESLint, Prettier, Husky + lint-staged, Commitlint
- Routing/state/data: TanStack Router, TanStack Query, Zustand
- UI: Tailwind CSS, Radix UI primitives, Lucide icons, Sonner toasts
- i18n: i18next + react-i18next

## Quick start

> [!IMPORTANT]
> You must set `VITE_API_URL` before running (see Environment below).

```bash
# install deps
pnpm install

# start dev server
pnpm dev

# type-check, lint, format
pnpm type-check
pnpm lint
pnpm format

# run unit tests
pnpm test

# build and preview
pnpm build
pnpm start
```

## Environment

Create a `.env.local` (or `.env`) at the project root:

```bash
VITE_API_URL=https://your-api.example.com
```

The Axios client prefixes requests with `${VITE_API_URL}/api` and attaches `Authorization: Bearer <token>` from `localStorage`.

> [!WARNING]
> Tokens are stored in `localStorage` (see `src/shared/lib/axios-client.ts`). Ensure HTTPS and appropriate server-side protections.

## Project structure (highlights)

```
src/
  modules/
    auth/          # auth forms, mutations, and services (login/signup/OTP)
    lessons/       # lesson views and queries
    levels/        # level selection/progress
  routes/
    __root.tsx
    $locale/       # localized routes and layouts (en/ar)
  shared/
    components/    # UI components (header, sidebar, form fields, etc.)
    hooks/         # use-locale, state stores, etc.
    i18n/          # i18next setup, resources, and locale-aware routing helpers
    lib/           # axios client, utilities
    styles/        # Tailwind entry
```

## Routing and i18n

- Entry file: `src/main.tsx` bootstraps TanStack Router and React Query.
- Root route: `src/routes/__root.tsx` renders `HeadContent`, `Outlet`, and global `Toaster`.
- Localized layout: `src/routes/$locale/_globalLayout.tsx` validates `:locale` (`en` | `ar`), sets `dir` and `lang`.
- Use `Link`/`useNavigate` from `src/shared/i18n/routing.tsx` to automatically prefix paths with the current locale.

Generate locale typings/content:

```bash
pnpm generate:locales
```

## Authentication

- Context: `src/shared/components/contexts/auth-context.tsx` exposes `user`, `logout`, and status flags (via Query `getMe`).
- Guards: `src/shared/components/protected-route.tsx` wraps routes, handling OTP gate and 401 redirects.
- Mutations: `src/modules/auth/mutations.ts` handles `useLogin`, `useSignup`, `useVerifyOtp`, `useResendOtp`.
- Services: `src/modules/auth/services.ts` hits `/auth/login`, `/auth/signup`, `/auth/verify-otp`, `/auth/resend-otp`.

> [!TIP]
> After login/signup, the `access_token` is stored, then the user is redirected to `/app` or to email verification.

## Available scripts

- `pnpm dev` — start Vite dev server
- `pnpm build` — type-check then build
- `pnpm start` — preview production build
- `pnpm test` — run unit tests (Vitest, jsdom)
- `pnpm lint` — ESLint
- `pnpm type-check` — TypeScript project references
- `pnpm format` — Prettier (with Tailwind plugin)
- `pnpm generate:locales` — build i18n resources

## Deployment

The project is SPA-ready for Vercel. See `vercel.json` for the catch-all rewrite to `index.html`.

> [!NOTE]
> Ensure `VITE_API_URL` is configured via Vercel Project Settings → Environment Variables.

## Screens, modules, and UI

- Lessons include reading, writing, listening, speaking, grammar, idioms, pictures, Q&A, and daily tests (`src/modules/lessons/components/*`).
- Levels provide day-by-day progress tracking and guards.
- UI is composed of reusable components in `src/shared/components/ui` with Tailwind and Radix primitives.

---

If you have questions or need tweaks to the setup, open an issue or adjust the configuration files as needed.
