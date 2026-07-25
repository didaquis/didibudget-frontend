import { render, screen } from '@testing-library/react'

import { SearchExpensesResults } from './'

const categories = [
	{
		_id: 'category-id-1',
		name: 'Private vehicles',
		uuid: 'category-uuid-1',
		subcategories: [
			{ _id: 'subcategory-id-1', name: 'Fuel', uuid: 'subcategory-uuid-1' }
		]
	},
	{
		_id: 'category-id-2',
		name: 'Groceries, personal care products',
		uuid: 'category-uuid-2',
		subcategories: []
	}
]

const firstOfFebruary = String(new Date(2026, 1, 1).getTime())

const searchResult = {
	expenses: [
		{
			uuid: 'expense-uuid-1',
			date: firstOfFebruary,
			category: 'category-id-1',
			subcategory: 'subcategory-id-1',
			quantity: 64.2,
			currencyISO: 'EUR'
		},
		{
			uuid: 'expense-uuid-2',
			date: firstOfFebruary,
			category: 'category-id-2',
			subcategory: null,
			quantity: 23.15,
			currencyISO: 'EUR'
		}
	],
	pagination: { currentPage: 1, totalPages: 3, totalCount: 37 },
	totalSum: 1284.6,
	currencyISO: 'EUR',
	breakdown: [
		{ category: 'category-id-1', subcategory: 'subcategory-id-1', sum: 612.4, count: 18 },
		{ category: 'category-id-2', subcategory: null, sum: 672.2, count: 19 }
	]
}

describe('SearchExpensesResults', () => {
	it('should display the total amount and the number of expenses', () => {
		render(<SearchExpensesResults searchResult={searchResult} categories={categories} onChangePage={vi.fn()} />)

		expect(screen.getByText('1284.6 EUR')).toBeInTheDocument()
		expect(screen.getByText('37 expenses')).toBeInTheDocument()
	})

	it('should display one breakdown row per entry, with resolved names', () => {
		render(<SearchExpensesResults searchResult={searchResult} categories={categories} onChangePage={vi.fn()} />)

		expect(screen.getByText('Private vehicles - Fuel · 18')).toBeInTheDocument()
		expect(screen.getByText('Groceries, personal care products · 19')).toBeInTheDocument()
	})

	it('should display one table row per expense, with the date and the resolved names', () => {
		render(<SearchExpensesResults searchResult={searchResult} categories={categories} onChangePage={vi.fn()} />)

		expect(screen.getAllByText('2026-02-01')).toHaveLength(2)
		expect(screen.getByText('64.2 EUR')).toBeInTheDocument()
		expect(screen.getByText('23.15 EUR')).toBeInTheDocument()
	})

	it('should not offer any action to delete an expense', () => {
		render(<SearchExpensesResults searchResult={searchResult} categories={categories} onChangePage={vi.fn()} />)

		expect(screen.queryByText('Delete')).not.toBeInTheDocument()
	})

	it('should display an alert when the search returns no expenses', () => {
		const emptyResult = {
			...searchResult,
			expenses: [],
			pagination: { currentPage: 1, totalPages: 0, totalCount: 0 },
			totalSum: 0,
			breakdown: []
		}

		render(<SearchExpensesResults searchResult={emptyResult} categories={categories} onChangePage={vi.fn()} />)

		expect(screen.getByText('No expenses found')).toBeInTheDocument()
	})
})
