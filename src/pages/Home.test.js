import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { MockedProvider } from '@apollo/client/testing'
import { InMemoryCache } from '@apollo/client'

import Home from './Home'
import { AuthContext } from '../AuthContext'
import { GET_ALL_RECURRING_EXPENSE_SUGGESTIONS, GET_MONTH_TO_DATE_SPENDING } from '../gql/queries/expenses'

const dashboardMocks = [
	{
		request: { query: GET_MONTH_TO_DATE_SPENDING },
		variableMatcher: () => true,
		result: { data: { getExpensesBetweenDates: [], getExpenseCategory: [] } }
	},
	{
		request: { query: GET_ALL_RECURRING_EXPENSE_SUGGESTIONS },
		variableMatcher: () => true,
		result: { data: { getRecurringExpenseSuggestionsByDay: [] } }
	}
]

const renderHome = (isAuth) => render(
	<MockedProvider mocks={dashboardMocks} cache={new InMemoryCache()}>
		<AuthContext.Provider value={{ isAuth, userData: {}, activateAuth: vi.fn(), removeAuth: vi.fn() }}>
			<MemoryRouter>
				<Home />
			</MemoryRouter>
		</AuthContext.Provider>
	</MockedProvider>
)

describe('Home', () => {
	it('greets a visitor without a session with the hero', () => {
		renderHome(false)

		expect(screen.getByRole('heading', { name: 'didibudget' })).toBeVisible()
		expect(screen.queryByRole('heading', { name: 'Dashboard' })).not.toBeInTheDocument()
	})

	it('shows the dashboard to a user with a session', async () => {
		renderHome(true)
		await waitForElementToBeRemoved(() => [
			screen.queryByRole('status'),
			screen.queryByText('Loading...')
		].filter(Boolean))

		expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
		expect(screen.queryByRole('heading', { name: 'didibudget' })).not.toBeInTheDocument()
	})
})
