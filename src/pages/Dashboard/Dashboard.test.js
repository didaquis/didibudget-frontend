import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { MockedProvider } from '@apollo/client/testing'

import Dashboard from './Dashboard'
import { AuthContext } from '../../AuthContext'
import { GET_ALL_RECURRING_EXPENSE_SUGGESTIONS, GET_MONTH_TO_DATE_SPENDING } from '../../gql/queries/expenses'

const monthMock = {
	request: { query: GET_MONTH_TO_DATE_SPENDING },
	variableMatcher: () => true,
	result: { data: { getExpensesBetweenDates: [], getExpenseCategory: [] } }
}

const suggestionsMock = {
	request: { query: GET_ALL_RECURRING_EXPENSE_SUGGESTIONS },
	variableMatcher: () => true,
	result: { data: { getRecurringExpenseSuggestionsByDay: [] } }
}

const renderDashboard = () => render(
	<MockedProvider mocks={[monthMock, suggestionsMock]}>
		<AuthContext.Provider value={{ isAuth: true, userData: { email: 'foo@mail.com', isAdmin: false } }}>
			<MemoryRouter>
				<Dashboard />
			</MemoryRouter>
		</AuthContext.Provider>
	</MockedProvider>
)

describe('Dashboard', () => {
	it('offers a way straight to adding a spending', () => {
		renderDashboard()

		expect(screen.getByRole('link', { name: 'Add spending' })).toHaveAttribute('href', '/spending/add')
	})

	it('places every section one level below the page title', async () => {
		renderDashboard()

		expect(await screen.findByRole('heading', { name: 'Suggestions', level: 2 })).toBeVisible()
		expect(screen.getByRole('heading', { name: 'Your user data', level: 2 })).toBeVisible()
	})
})
