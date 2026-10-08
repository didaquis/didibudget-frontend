import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { MockedProvider } from '@apollo/client/testing'

import Dashboard from './Dashboard'
import { GET_ALL_RECURRING_EXPENSE_SUGGESTIONS, GET_MONTH_TO_DATE_SPENDING } from '../../gql/queries/expenses'

const monthMock = {
	request: { query: GET_MONTH_TO_DATE_SPENDING },
	variableMatcher: () => true,
	result: { data: { getExpensesBetweenDates: [], getExpenseCategory: [] } }
}

const suggestionsMock = {
	request: { query: GET_ALL_RECURRING_EXPENSE_SUGGESTIONS },
	variableMatcher: () => true,
	result: {
		data: {
			getRecurringExpenseSuggestionsByDay: [
				{
					__typename: 'RecurringExpenseSuggestion',
					uuid: 'suggestion-uuid',
					suggestedExpense: {
						__typename: 'SuggestedExpense',
						category: 'home-id',
						categoryName: 'Home',
						categoryEmojis: ['🏠'],
						subcategory: null,
						subcategoryName: null,
						subcategoryEmojis: [],
						quantity: 40
					}
				}
			]
		}
	}
}

const renderDashboard = () => render(
	<MockedProvider mocks={[monthMock, suggestionsMock]}>
		<MemoryRouter>
			<Dashboard />
		</MemoryRouter>
	</MockedProvider>
)

describe('Dashboard', () => {
	it('offers a way straight to adding a spending', () => {
		renderDashboard()

		expect(screen.getByRole('link', { name: 'Add spending' })).toHaveAttribute('href', '/spending/add')
	})

	it('places the suggestions one level below the page title', async () => {
		renderDashboard()

		expect(await screen.findByRole('heading', { name: 'Suggestions', level: 2 })).toBeVisible()
	})
})
