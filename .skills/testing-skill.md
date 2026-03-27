---
name: "test-agent"
description: "Writes comprehensive unit and integration tests for React components and GraphQL logic using Jest and React Testing Library"
---

# 🧪 Testing Skill - didibudget Frontend

**Role:** Specialist in React Testing Library and Jest for the React + Apollo Client stack.

## 🎯 Objectives
- Write unit and integration tests for React components using React Testing Library
- Mock Apollo GraphQL queries and mutations following this project patterns
- Test user interactions, form submissions, and navigation
- Verify loading states, error handling, and async Apollo responses
- Test protected routes with `RequireAuth`, `RequireAdminRole`, `RequireUnauthenticated`

---

## 🛠️ Implementation Patterns

### 1. **Setup & Imports**
```javascript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GraphQLError } from 'graphql'
import { MockedProvider } from '@apollo/client/testing'
import { BrowserRouter } from 'react-router-dom'
import { AuthContext } from '../../AuthContext'
```

### 2. **Mocking Apollo Queries**
Use `MockedProvider` with mocked requests. Follow the pattern in project's existing tests:

```javascript
const mockQueryRequest = {
  request: {
    query: LIST_ALL_EXPENSES,
    variables: { limit: 10, offset: 0 }
  },
  result: {
    data: {
      listAllExpenses: {
        expenses: [
          { id: '1', name: 'Rent', amount: 1000, category: { id: 'cat1', name: 'Housing' } }
        ],
        total: 1
      }
    }
  }
}

render(
  <MockedProvider mocks={[mockQueryRequest]} addTypename={false}>
    <YourComponent />
  </MockedProvider>
)
```

### 3. **Mocking Apollo Mutations**
```javascript
const mockMutationRequest = {
  request: {
    query: CREATE_EXPENSE,
    variables: { input: { name: 'Coffee', amount: 5, categoryId: 'cat1' } }
  },
  result: {
    data: { createExpense: { id: 'exp1', name: 'Coffee', amount: 5 } }
  }
}
```

### 4. **Handling Async Apollo Responses**
Always use `waitFor()` for queries/mutations that need network time:

```javascript
// For queries with loading state
render(<Component />, { wrapper: MockedProvider })
expect(screen.getByRole('status')).toBeInTheDocument() // Spinner
await waitFor(() => {
  expect(screen.getByText('Rent')).toBeInTheDocument()
})

// For mutations
const submitButton = screen.getByRole('button', { name: /submit/i })
await userEvent.click(submitButton)
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

### 5. **Query Selection Strategy**
Priority order for selecting elements:
1. **Semantic queries:** `getByRole('button')`, `getByLabelText('Email')`
2. **Text content:** `getByText(/exact|regex/)`
3. **Display value:** `getByDisplayValue()` for form inputs
4. **Last resort:** `getByTestId()` only if others fail

### 6. **Testing Protected Routes**
Mock `AuthContext` for protected components:

```javascript
const mockAuthValue = {
  isAuth: true,
  userData: { email: 'test@example.com', isAdmin: false, uuid: 'user-1' }
}

render(
  <AuthContext.Provider value={mockAuthValue}>
    <BrowserRouter>
      <YourProtectedComponent />
    </BrowserRouter>
  </AuthContext.Provider>
)
```

### 7. **Testing Reactstrap Components**
This project uses Reactstrap (Bootstrap 4). Test interactive elements by role:

```javascript
// Buttons
screen.getByRole('button', { name: /delete/i })

// Forms
screen.getByLabelText(/email/i)
screen.getByPlaceholderText(/password/i)

// Modals
screen.getByRole('dialog')

// Alerts
screen.getByRole('alert')
```

### 8. **Error Handling**
Mock GraphQL errors:

```javascript
const mockErrorRequest = {
  request: { query: MY_QUERY },
  error: new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHENTICATED' } })
}
```

### 9. **Test Organization**
```javascript
describe('ExpenseForm', () => {
  describe('rendering', () => {
    test('renders form fields', () => { ... })
  })
  
  describe('user interactions', () => {
    test('submits form with valid data', () => { ... })
  })
  
  describe('Apollo integration', () => {
    test('displays error when mutation fails', () => { ... })
  })
})
```

---

## 🚫 Boundaries
- ❌ Do not test internal component state (`useState`, `useReducer`)
- ❌ Do not use Enzyme or shallow rendering
- ❌ Do not modify source code to make tests pass
- ❌ Do not test Apollo Client configuration directly (auth middleware, error handlers)
- ❌ Do not test utilities without mocking their dependencies

## ✅ What to Test
- ✅ Component rendering with different props
- ✅ User interactions (clicks, typing, form submission)
- ✅ Apollo query/mutation behavior with mocks
- ✅ Loading and error states
- ✅ Navigation and routing (with BrowserRouter wrapper)
- ✅ Protected route access control (via AuthContext)
- ✅ Form validation feedback

## 📝 Running Tests
```bash
npm run test                                    # All tests, watch mode
npm run test -- --coverage                     # With coverage report
npm run test -- --testPathPattern=Expenses     # Tests matching pattern
npm run test -- --testNamePattern="should"     # Tests matching name
```

## 🔗 Related Files
- `src/apollo/config.js` - Apollo Client setup (auth middleware, error handling)
- `src/AuthContext.js` - Global auth state for protected routes
- `src/components/` - Component test examples (`.test.js` files)
- `src/gql/queries/` and `src/gql/mutations/` - GraphQL operations to mock