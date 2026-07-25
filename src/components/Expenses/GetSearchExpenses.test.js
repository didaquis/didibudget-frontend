import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import { GetSearchExpenses } from './GetSearchExpenses'
import { LIST_EXPENSE_CATEGORIES } from '../../gql/queries/expenseCategories'

vi.mock('./SearchExpensesFilters', () => ({
	SearchExpensesFilters: () => 'filters form'
}))

vi.mock('./SearchExpensesResults', () => ({
	SearchExpensesResults: () => 'results'
}))

const categoriesMock = {
	request: { query: LIST_EXPENSE_CATEGORIES },
	result: {
		data: {
			getExpenseCategory: [
				{
					_id: 'category-id-1',
					name: 'Private vehicles',
					emojis: ['🚙'],
					uuid: 'category-uuid-1',
					subcategories: [
						{ _id: 'subcategory-id-1', name: 'Fuel', uuid: 'subcategory-uuid-1', emojis: ['⛽️'] }
					]
				}
			]
		}
	}
}

describe('GetSearchExpenses', () => {
	it('should display a spinner while the categories are loading', () => {
		render(
			<MockedProvider mocks={[categoriesMock]} addTypename={false}>
				<GetSearchExpenses />
			</MockedProvider>
		)

		expect(screen.getByText('Loading...')).toBeInTheDocument()
	})

	it('should display the filters form once the categories are loaded', async () => {
		render(
			<MockedProvider mocks={[categoriesMock]} addTypename={false}>
				<GetSearchExpenses />
			</MockedProvider>
		)

		expect(await screen.findByText('filters form')).toBeInTheDocument()
	})

	it('should not display any result before the first search', async () => {
		render(
			<MockedProvider mocks={[categoriesMock]} addTypename={false}>
				<GetSearchExpenses />
			</MockedProvider>
		)

		await screen.findByText('filters form')

		expect(screen.queryByText('results')).not.toBeInTheDocument()
	})

	it('should display an alert when the categories cannot be loaded', async () => {
		const errorMock = {
			request: { query: LIST_EXPENSE_CATEGORIES },
			error: new Error('Categories are not available')
		}

		render(
			<MockedProvider mocks={[errorMock]} addTypename={false}>
				<GetSearchExpenses />
			</MockedProvider>
		)

		expect(await screen.findByText('Categories are not available')).toBeInTheDocument()
	})
})
