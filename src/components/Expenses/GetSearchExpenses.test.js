import { render, screen, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import { GetSearchExpenses } from './GetSearchExpenses'
import { LIST_EXPENSE_CATEGORIES } from '../../gql/queries/expenseCategories'
import { SEARCH_EXPENSES } from '../../gql/queries/expenses'
import { buildSearchVariables } from './SearchExpensesFilters/utils'

const someFilters = vi.hoisted(() => ({
	category: 'category-id-1',
	subcategory: 'subcategory-id-1',
	startDate: null,
	endDate: null,
	minQuantity: '',
	maxQuantity: '',
	sortBy: 'date',
	sortDirection: 'desc'
}))

vi.mock('./SearchExpensesFilters', () => {
	const React = require('react')
	return {
		SearchExpensesFilters: ({ onSearch }) => React.createElement(
			'button',
			{ onClick: () => onSearch(someFilters) },
			'search'
		)
	}
})

vi.mock('./SearchExpensesResults', () => {
	const React = require('react')
	return {
		SearchExpensesResults: ({ onChangePage }) => React.createElement(
			'div',
			null,
			'results',
			React.createElement('button', { onClick: () => onChangePage(2) }, 'next page')
		)
	}
})

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

const searchResultMock = {
	expenses: [],
	pagination: { currentPage: 1, totalPages: 1, totalCount: 0 },
	totalSum: 0,
	currencyISO: 'EUR',
	breakdown: []
}

const searchExpensesPage1Mock = {
	request: { query: SEARCH_EXPENSES, variables: buildSearchVariables(someFilters, 1, 25) },
	result: { data: { searchExpenses: searchResultMock } }
}

const searchExpensesPage2Mock = {
	request: { query: SEARCH_EXPENSES, variables: buildSearchVariables(someFilters, 2, 25) },
	result: { data: { searchExpenses: searchResultMock } }
}

describe('GetSearchExpenses', () => {
	it('should display a spinner while the categories are loading', () => {
		render(
			<MockedProvider mocks={[categoriesMock]} addTypename={false}>
				<GetSearchExpenses />
			</MockedProvider>
		)

		expect(screen.getByText('Loading...')).toBeVisible()
	})

	it('should display the filters form once the categories are loaded', async () => {
		render(
			<MockedProvider mocks={[categoriesMock]} addTypename={false}>
				<GetSearchExpenses />
			</MockedProvider>
		)

		expect(await screen.findByText('search')).toBeVisible()
	})

	it('should not display any result before the first search', async () => {
		render(
			<MockedProvider mocks={[categoriesMock]} addTypename={false}>
				<GetSearchExpenses />
			</MockedProvider>
		)

		await screen.findByText('search')

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

		expect(await screen.findByText('Categories are not available')).toBeVisible()
	})

	it('should run the search with the variables built from the filters and display the results', async () => {
		render(
			<MockedProvider mocks={[categoriesMock, searchExpensesPage1Mock]} addTypename={false}>
				<GetSearchExpenses />
			</MockedProvider>
		)

		fireEvent.click(await screen.findByText('search'))

		expect(await screen.findByText('results')).toBeVisible()
	})

	it('should re-issue the search with the same filters and the new page when the page changes', async () => {
		render(
			<MockedProvider mocks={[categoriesMock, searchExpensesPage1Mock, searchExpensesPage2Mock]} addTypename={false}>
				<GetSearchExpenses />
			</MockedProvider>
		)

		fireEvent.click(await screen.findByText('search'))
		await screen.findByText('results')

		fireEvent.click(screen.getByText('next page'))

		expect(await screen.findByText('results')).toBeVisible()
	})
})
