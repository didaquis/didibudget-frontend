import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import { GetAddExpenseData } from './GetAddExpenseData'
import { LIST_EXPENSE_CATEGORIES, GET_MOST_USED_EXPENSE_CATEGORIES } from '../../gql/queries/expenseCategories'

vi.mock('./AddExpenseForm', () => {
	const React = require('react')
	return {
		AddExpenseForm: ({ frequentCategories }) => React.createElement(
			'div',
			null,
			`form with ${frequentCategories.length} frequent categories`
		)
	}
})

const categoriesMock = {
	request: { query: LIST_EXPENSE_CATEGORIES },
	result: {
		data: {
			getExpenseCategory: [
				{ _id: 'category-id-2', name: 'Taxes', emojis: ['🏛'], uuid: 'category-uuid-2', subcategories: [] }
			]
		}
	}
}

const frequentMock = {
	request: { query: GET_MOST_USED_EXPENSE_CATEGORIES, variables: { days: 90, limit: 6 } },
	result: {
		data: {
			getMostUsedExpenseCategories: [
				{
					category: 'category-id-2',
					categoryName: 'Taxes',
					categoryEmojis: ['🏛'],
					subcategory: null,
					subcategoryName: null,
					subcategoryEmojis: []
				}
			]
		}
	}
}

const failingFrequentMock = {
	request: { query: GET_MOST_USED_EXPENSE_CATEGORIES, variables: { days: 90, limit: 6 } },
	error: new Error('No frequent categories available')
}

const failingCategoriesMock = {
	request: { query: LIST_EXPENSE_CATEGORIES },
	error: new Error('No categories available')
}

describe('GetAddExpenseData', () => {
	it('passes the frequent categories to the form', async () => {
		render(
			<MockedProvider mocks={[categoriesMock, frequentMock]} addTypename={false}>
				<GetAddExpenseData />
			</MockedProvider>
		)

		expect(await screen.findByText('form with 1 frequent categories')).toBeVisible()
	})

	it('still renders the form when the frequent categories fail', async () => {
		render(
			<MockedProvider mocks={[categoriesMock, failingFrequentMock]} addTypename={false}>
				<GetAddExpenseData />
			</MockedProvider>
		)

		expect(await screen.findByText('form with 0 frequent categories')).toBeVisible()
	})

	it('shows an error when the categories fail', async () => {
		render(
			<MockedProvider mocks={[failingCategoriesMock, frequentMock]} addTypename={false}>
				<GetAddExpenseData />
			</MockedProvider>
		)

		expect(await screen.findByRole('alert')).toBeVisible()
	})
})
