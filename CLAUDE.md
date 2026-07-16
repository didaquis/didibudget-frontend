# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

didibudget is a money-management SPA (track expenses, monthly balances, savings/investments). It is the **frontend only** and talks to a separate GraphQL backend (https://github.com/didaquis/didibudget-backend) via Apollo Client. The backend must be running for the app to function.

Stack: React 18, React Router 6, Apollo Client 3, Reactstrap (Bootstrap 5), Recharts. Build/dev with Vite; tests with Vitest + React Testing Library.

`AGENTS.md` contains a longer Copilot-oriented walkthrough — consult it for additional detail. The codebase is plain JavaScript.

## Commands

```bash
npm run dev                  # Vite dev server (http://localhost:5173)
npm run build                # Production bundle → ./dist/
npm run lint                 # ESLint over ./src
npm run lint -- --fix        # Auto-fix lint violations
npm run test                 # Run all tests once
npm run test:watch           # Tests in watch mode
npm run test -- utils        # Run tests matching a pattern (e.g. filename substring)
npm run test -- --coverage   # With coverage report
```

Requires Node 24.14 (see `.nvmrc`). Copy `_env` to `.env` and set `VITE_PROTOCOL`, `VITE_HOST`, `VITE_PORT`, `VITE_GRAPHQL` before running.

## Conventions (enforced by ESLint)

- **No semicolons**, **single quotes**, `curly` required, `no-return-await`.
- Indentation is **tabs**.
- Source files are `.js` but **contain JSX**; Vite's esbuild is configured to load `src/**/*.js` as JSX (`vite.config.js`). Do not rename to `.jsx`.

## Architecture

- **Entry**: `src/index.js` mounts `<App>` wrapped in `AuthContext` Provider and Apollo Provider. `src/App.js` defines all routes.
- **Auth** (`src/AuthContext.js`): global `isAuth` / `userData` state. `userData` is decoded from the JWT (`jsonwebtoken`) and holds email, isAdmin, isActive, registrationDate, uuid. Tokens + user data live in **sessionStorage** via `src/utils/session.js`, so auth survives page reloads.
- **Apollo** (`src/apollo/config.js`): a link chain — `authMiddleware` (attaches `Bearer <token>` from session) → `errorLink` (on `UNAUTHENTICATED`/`FORBIDDEN` graphQL errors or `invalid_token` network errors, clears session and hard-redirects to `/`; rewrites `INTERNAL_SERVER_ERROR` messages) → `httpLink`. Changing this affects every API call.
- **Routing** (`src/App.js`): React Router 6. Pages are lazy-loaded behind a `<Suspense>` spinner. Routes are guarded by wrapper components `RequireAuth`, `RequireUnauthenticated`, and `RequireAdminRole` (admin routes nest `RequireAdminRole` inside `RequireAuth`).
- **GraphQL** (`src/gql/`): `queries/` and `mutations/` split by entity (expenses, users, monthlyBalances, expenseCategories, auth). Operations are named exports (e.g. `LIST_ALL_EXPENSES`).
- **Data-fetching components**: under `src/components/<Entity>/`, files named `Get*.js` (e.g. `GetListOfExpensesWithPagination.js`) wrap a `useQuery`/`useMutation` and handle loading/error, keeping fetching separate from presentation. Standard pattern: `if (loading) return <Spinner />; if (error) return <ErrorAlert error={error} />`.
- **pages/** are route-level screens; **components/** are reusable UI (each usually an `index.js`, often with a colocated `index.test.js`).

## Testing notes

- Test files are colocated with the `.test.js` suffix; environment is `jsdom` with globals enabled and `TZ=Europe/Madrid` (set in `vite.config.js`) — relevant for date-sensitive tests.
- Setup file `vitest.setup.js` pulls in `@testing-library/jest-dom` matchers.

## Files to change with care

`vite.config.js` (build + test env), `src/apollo/config.js` (auth/error middleware, all API calls), `src/AuthContext.js` (global auth + routing guards).
