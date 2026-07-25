import { render, screen, fireEvent } from '@testing-library/react'

import { SearchExpensesFilters } from './'

const categories = [
	{
		_id: 'category-id-1',
		name: 'Private vehicles',
		uuid: 'category-uuid-1',
		subcategories: [
			{ _id: 'subcategory-id-1', name: 'Fuel', uuid: 'subcategory-uuid-1' },
			{ _id: 'subcategory-id-2', name: 'Garage', uuid: 'subcategory-uuid-2' }
		]
	},
	{
		_id: 'category-id-2',
		name: 'Home',
		uuid: 'category-uuid-2',
		subcategories: [
			{ _id: 'subcategory-id-3', name: 'Electricity bill', uuid: 'subcategory-uuid-3' }
		]
	}
]

describe('SearchExpensesFilters', () => {
	it('should disable the subcategory selector while no category is selected', () => {
		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		expect(screen.getByLabelText('Subcategory')).toBeDisabled()
	})

	it('should offer the subcategories of the selected category', () => {
		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'category-id-1' } })

		expect(screen.getByLabelText('Subcategory')).not.toBeDisabled()
		expect(screen.getByRole('option', { name: 'Fuel' })).toBeInTheDocument()
		expect(screen.getByRole('option', { name: 'Garage' })).toBeInTheDocument()
		expect(screen.queryByRole('option', { name: 'Electricity bill' })).not.toBeInTheDocument()
	})

	it('should reset the selected subcategory when the category changes', () => {
		const onSearch = vi.fn()

		render(<SearchExpensesFilters categories={categories} onSearch={onSearch} />)

		fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'category-id-1' } })
		fireEvent.change(screen.getByLabelText('Subcategory'), { target: { value: 'subcategory-id-1' } })
		fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'category-id-2' } })

		expect(screen.getByLabelText('Subcategory')).toHaveValue('')

		fireEvent.click(screen.getByRole('button', { name: 'Search' }))

		expect(onSearch).toHaveBeenCalledWith(expect.objectContaining({ subcategory: '' }))
	})

	it('should call onSearch with the filters filled in', () => {
		const onSearch = vi.fn()

		render(<SearchExpensesFilters categories={categories} onSearch={onSearch} />)

		fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'category-id-1' } })
		fireEvent.change(screen.getByLabelText('Min amount'), { target: { value: '23,15' } })
		fireEvent.click(screen.getByRole('button', { name: 'Search' }))

		expect(onSearch).toHaveBeenCalledTimes(1)
		expect(onSearch).toHaveBeenCalledWith({
			category: 'category-id-1',
			subcategory: '',
			startDate: null,
			endDate: null,
			minQuantity: '23,15',
			maxQuantity: '',
			sortBy: 'date',
			sortDirection: 'desc'
		})
	})

	it('should search sorted by date descending by default', () => {
		const onSearch = vi.fn()

		render(<SearchExpensesFilters categories={categories} onSearch={onSearch} />)

		fireEvent.click(screen.getByRole('button', { name: 'Search' }))

		expect(onSearch.mock.calls[0][0].sortBy).toBe('date')
		expect(onSearch.mock.calls[0][0].sortDirection).toBe('desc')
	})

	it('should collapse the filters after searching, and expand them again on demand', () => {
		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		const toggle = screen.getByRole('button', { name: 'All categories' })
		expect(toggle).toHaveAttribute('aria-expanded', 'true')

		fireEvent.click(screen.getByRole('button', { name: 'Search' }))
		expect(toggle).toHaveAttribute('aria-expanded', 'false')

		fireEvent.click(toggle)
		expect(toggle).toHaveAttribute('aria-expanded', 'true')
	})

	it('should point the toggle button at the collapsed region via aria-controls', () => {
		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		const toggle = screen.getByRole('button', { name: 'All categories' })
		const panelId = toggle.getAttribute('aria-controls')

		expect(panelId).toBeTruthy()
		expect(document.getElementById(panelId)).toBeInTheDocument()
	})

	it('should summarize the active filters as the toggle button label', () => {
		const onSearch = vi.fn()

		render(<SearchExpensesFilters categories={categories} onSearch={onSearch} />)

		fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'category-id-1' } })

		expect(screen.getByRole('button', { name: 'Private vehicles' })).toBeInTheDocument()

		fireEvent.click(screen.getByRole('button', { name: 'Search' }))

		expect(screen.getByRole('button', { name: 'Private vehicles' })).toHaveAttribute('aria-expanded', 'false')
	})

	it('should give the date fields an accessible name reaching the real input', () => {
		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		expect(screen.getByLabelText('From')).toBeInTheDocument()
		expect(screen.getByLabelText('To')).toBeInTheDocument()
	})

	it('should keep the date fields read only, so a typed date can never be silently discarded', () => {
		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		expect(screen.getByLabelText('From')).toHaveAttribute('readonly')
		expect(screen.getByLabelText('To')).toHaveAttribute('readonly')
	})

	it('should open the calendar when a date field is tapped', () => {
		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		expect(document.querySelector('table')).not.toBeInTheDocument()

		fireEvent.click(screen.getByLabelText('From'))

		expect(document.querySelector('table')).toBeInTheDocument()
	})

	it('should reach onSearch with a Date when a day is picked from the calendar', () => {
		const onSearch = vi.fn()

		render(<SearchExpensesFilters categories={categories} onSearch={onSearch} />)

		fireEvent.click(screen.getByLabelText('From'))

		const dayCells = document.querySelectorAll('table tbody td')
		fireEvent.click(dayCells[15])

		fireEvent.click(screen.getByRole('button', { name: 'Search' }))

		expect(onSearch).toHaveBeenCalledTimes(1)
		expect(onSearch.mock.calls[0][0].startDate).toBeInstanceOf(Date)
	})

	it('should disable the Search button and show a message when an amount is not a valid number', () => {
		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		fireEvent.change(screen.getByLabelText('Min amount'), { target: { value: 'abc' } })

		expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled()
		expect(screen.getByText('Amount must be a number using a decimal point or comma')).toBeInTheDocument()
	})

	it('should keep the Search button enabled when the amount is a valid number', () => {
		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		fireEvent.change(screen.getByLabelText('Min amount'), { target: { value: '23,15' } })

		expect(screen.getByRole('button', { name: 'Search' })).not.toBeDisabled()
		expect(screen.queryByText('Amount must be a number using a decimal point or comma')).not.toBeInTheDocument()
	})

	it('should keep the Search button enabled when the amount is left empty', () => {
		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		expect(screen.getByRole('button', { name: 'Search' })).not.toBeDisabled()
		expect(screen.queryByText('Amount must be a number using a decimal point or comma')).not.toBeInTheDocument()
	})
})
