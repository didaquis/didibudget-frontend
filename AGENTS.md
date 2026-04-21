# Copilot Instructions for didibudget-frontend

## Project Overview

**didibudget** is a money management web application built with React and GraphQL. It allows users to track expenses, manage monthly balances, and view savings/investments. The frontend communicates with a separate backend API via Apollo Client.

- **Tech Stack**: React 18, React Router 6, Apollo Client 3, Reactstrap (Bootstrap 4)
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint

## Setup & Development

### Initial Setup
```bash
npm install
# Copy _env to .env and configure backend connection
cp _env .env
```

### Running Locally
```bash
npm run dev              # Dev server at http://localhost:5173
npm run build              # Production build (output: ./dist/)
npm run lint               # ESLint check
npm run test               # Run all tests with watch mode
npm run test -- utils        # Run specific test file (pattern match)
```

### Environment Configuration (.env)
Required variables for connecting to backend:
- `VITE_PROTOCOL`: `http` or `https`
- `VITE_HOST`: Backend IP or domain
- `VITE_PORT`: Backend port
- `VITE_GRAPHQL`: GraphQL endpoint path

## Architecture & Key Concepts

### Apollo Client Setup
Apollo is configured in `src/apollo/config.js` with:
- **Auth Middleware**: Automatically adds Bearer token from session storage to all GraphQL requests
- **Error Handling**: Catches `UNAUTHENTICATED` or `FORBIDDEN` errors and redirects to login
- **Token-based Authentication**: JWT tokens stored in sessionStorage

### Authentication Flow
- `src/AuthContext.js` provides global auth state (`isAuth`, `userData`)
- `userData` contains: email, isAdmin, isActive, registrationDate, uuid (decoded from JWT)
- Session tokens stored in sessionStorage via `src/utils/session.js`
- Route protection components: `RequireAuth`, `RequireUnauthenticated`, `RequireAdminRole`

### GraphQL Organization
- **Queries**: `src/gql/queries/` - Organized by entity (expenses, users, monthlyBalances, expenseCategories)
- **Mutations**: `src/gql/mutations/` - Organized by entity
- Named exports for query/mutation fragments and operations (e.g., `LIST_ALL_EXPENSES`, `EXPENSE_CATEGORY_FIELDS`)

### Component Structure
- **Pages**: `src/pages/` - Route-level components (Home, Dashboard, Login, Users, Expenses, etc.)
- **Components**: `src/components/` - Reusable UI components (forms, headers, alerts, etc.)
  - Each component typically has an `index.js` and may include `.test.js`
  - Components use Reactstrap for Bootstrap-based styling

### Code Style Conventions
- **Semicolons**: Disabled (eslint rule: `semi: warn, never`)
- **Quotes**: Single quotes enforced (eslint rule: `quotes: warn, single`)
- **Import Statement Order**: No explicit convention, but components typically import React/libraries first, then local components/utilities

### Routing
- React Router 6 (DOM-based)
- Lazy-loaded pages with `Suspense` fallback spinner
- Dynamic route parameters (e.g., `/register-expense/:categoryID/*`)
- Protected routes wrapped with context-based guards

## Code Patterns

### Using Apollo Queries
GraphQL queries return `{ data, loading, error }`. Example pattern:
```javascript
const { data, loading, error } = useQuery(QUERY_NAME)
if (loading) return <Spinner />
if (error) return <ErrorAlert error={error} />
// Use data...
```

### Mutations
Mutations typically use `useMutation` hook with error/success handling.

### Utilities
- `src/utils/session.js` - Session storage management (token, user data)
- `src/utils/validations.js` - Form validation logic
- `src/utils/utils.js` - Shared utility functions

## Testing

- Test files colocated with components/modules (`.test.js` suffix)
- Uses React Testing Library (component testing, NOT enzyme)
- Tests typically verify rendering and user interactions

Run tests:
```bash
npm run test                                    # All tests, watch mode
npm run test -- --coverage                     # With coverage report
npm run test -- utils        # Tests matching pattern
```

## Linting

```bash
npm run lint                        # Check all files in src/
npm run lint -- --fix               # Auto-fix violations
npm run lint -- src/pages/Login.js  # Lint specific file
```

## Build & Deployment

- **Development Build**: `npm run dev` uses Vite dev server
- **Production Build**: `npm run build` creates optimized bundle in `./dist/`
- Node polyfills for browser compatibility are handled via `vite-plugin-node-polyfills` in `vite.config.js`
- Deployed to Netlify (see README for deployment badge/link)

## Important Notes

- Backend must be running for the app to function (API dependency)
- Node.js 24.14 required
- Some dependencies polyfill Node.js modules for browser compatibility (stream-browserify, crypto-browserify, etc.) due to `crypto` and `vm` usage in the codebase
- Route-level components use lazy loading with Suspense for better performance
- Session-based authentication reuses token across page reloads via sessionStorage

## Files Not to Modify Without Consideration

- `vite.config.js` - Vite/Vitest config; changes affect build process and test environment
- `src/apollo/config.js` - Auth middleware and error handling; affects all API calls
- `src/AuthContext.js` - Global auth state; affects routing and protected components


## Code quality guidelines

- No hacks or quick fixes. We do not accept sloppy, fragile, or shortcut-based solutions. Code must be robust, intentional, and maintainable.
- Readability over cleverness. Prefer clear, explicit, and easy-to-understand code over compact, overly clever, or cryptic implementations.
- Maintainability first. Write code that is easy to reason about, modify, and debug by other developers in the future.
- Tests are expected. Most non-trivial code must be accompanied by appropriate unit tests. Tests should be meaningful, readable, and cover the main execution paths and edge cases.
- Consistency matters. Follow existing project conventions, naming standards, and architectural patterns.
- Fail explicitly. Handle errors clearly and predictably; avoid silent failures or ambiguous behavior.
- TypeScript over JavaScript. Prefer TypeScript instead of JavaScript. Use strict typing, explicit interfaces, and meaningful types to improve correctness and maintainability.
