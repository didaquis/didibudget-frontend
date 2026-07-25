import { render, screen, within } from '@testing-library/react'

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

	it('should display the breakdown rows in the order returned by the backend, with resolved names', () => {
		render(<SearchExpensesResults searchResult={searchResult} categories={categories} onChangePage={vi.fn()} />)

		const totalCard = screen.getByText('Total spent').closest('.card')
		const items = within(totalCard).getAllByRole('listitem')

		expect(items.map(item => item.querySelector('p').textContent)).toEqual([
			'Private vehicles - Fuel',
			'Groceries, personal care products'
		])

		expect(within(items[0]).getByText('18 expenses')).toBeInTheDocument()
		expect(within(items[0]).getByText('612.4 EUR')).toBeInTheDocument()
		expect(within(items[1]).getByText('19 expenses')).toBeInTheDocument()
		expect(within(items[1]).getByText('672.2 EUR')).toBeInTheDocument()
	})

	it('should label a single expense in the singular', () => {
		const singleExpenseResult = {
			...searchResult,
			pagination: { currentPage: 1, totalPages: 1, totalCount: 1 },
			breakdown: [
				{ category: 'category-id-1', subcategory: 'subcategory-id-1', sum: 64.2, count: 1 }
			]
		}

		render(<SearchExpensesResults searchResult={singleExpenseResult} categories={categories} onChangePage={vi.fn()} />)

		expect(screen.getAllByText('1 expense')).toHaveLength(2)
		expect(screen.queryByText('1 expenses')).not.toBeInTheDocument()
	})

	it('should display one table row per expense, with the date and the resolved names', () => {
		render(<SearchExpensesResults searchResult={searchResult} categories={categories} onChangePage={vi.fn()} />)

		expect(screen.getAllByText('2026-02-01')).toHaveLength(2)
		expect(screen.getByText('64.2 EUR')).toBeInTheDocument()
		expect(screen.getByText('23.15 EUR')).toBeInTheDocument()
	})

	it('should render nothing instead of the literal "null" when a category cannot be resolved', () => {
		const resultWithDeletedCategory = {
			...searchResult,
			expenses: [
				{
					uuid: 'expense-uuid-3',
					date: firstOfFebruary,
					category: 'deleted-category-id',
					subcategory: null,
					quantity: 10,
					currencyISO: 'EUR'
				}
			]
		}

		render(<SearchExpensesResults searchResult={resultWithDeletedCategory} categories={categories} onChangePage={vi.fn()} />)

		expect(screen.getByRole('cell', { name: '' })).toBeInTheDocument()
		expect(screen.queryByText('null')).not.toBeInTheDocument()
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

		expect(screen.getByText('No expenses found')).toBeVisible()
	})
})
