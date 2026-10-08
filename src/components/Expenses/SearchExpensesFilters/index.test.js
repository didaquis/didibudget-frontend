import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

const categoryWithoutSubcategories = { _id: 'category-id-3', name: 'Public transport', uuid: 'category-uuid-3', subcategories: [] }

describe('SearchExpensesFilters', () => {
	it('should disable the subcategory selector while no category is selected', () => {
		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		expect(screen.getByLabelText('Subcategory')).toBeDisabled()
	})

	it('should say why the subcategory selector cannot be used, in each of the two cases', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={[...categories, categoryWithoutSubcategories]} onSearch={vi.fn()} />)

		expect(screen.getByRole('option', { name: 'Select a category first' })).toBeVisible()

		await user.selectOptions(screen.getByLabelText('Category'), 'category-id-3')

		expect(screen.getByRole('option', { name: 'No subcategories' })).toBeVisible()

		await user.selectOptions(screen.getByLabelText('Category'), 'category-id-1')

		expect(screen.getByRole('option', { name: 'All subcategories' })).toBeVisible()
	})

	it('should keep the subcategory selector disabled for a category that has no subcategories', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={[categoryWithoutSubcategories]} onSearch={vi.fn()} />)

		await user.selectOptions(screen.getByLabelText('Category'), 'category-id-3')

		expect(screen.getByLabelText('Category')).toHaveValue('category-id-3')
		expect(screen.getByLabelText('Subcategory')).toBeDisabled()
	})

	it('should offer the subcategories of the selected category', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		await user.selectOptions(screen.getByLabelText('Category'), 'category-id-1')

		expect(screen.getByLabelText('Subcategory')).not.toBeDisabled()
		expect(screen.getByRole('option', { name: 'Fuel' })).toBeVisible()
		expect(screen.getByRole('option', { name: 'Garage' })).toBeVisible()
		expect(screen.queryByRole('option', { name: 'Electricity bill' })).not.toBeInTheDocument()
	})

	it('should reset the selected subcategory when the category changes', async () => {
		const user = userEvent.setup()
		const onSearch = vi.fn()

		render(<SearchExpensesFilters categories={categories} onSearch={onSearch} />)

		await user.selectOptions(screen.getByLabelText('Category'), 'category-id-1')
		await user.selectOptions(screen.getByLabelText('Subcategory'), 'subcategory-id-1')
		await user.selectOptions(screen.getByLabelText('Category'), 'category-id-2')

		expect(screen.getByLabelText('Subcategory')).toHaveValue('')

		await user.click(screen.getByRole('button', { name: 'Search' }))

		expect(onSearch).toHaveBeenCalledWith(expect.objectContaining({ subcategory: '' }))
	})

	it('should call onSearch with the filters filled in', async () => {
		const user = userEvent.setup()
		const onSearch = vi.fn()

		render(<SearchExpensesFilters categories={categories} onSearch={onSearch} />)

		await user.selectOptions(screen.getByLabelText('Category'), 'category-id-1')
		await user.type(screen.getByLabelText('Min amount'), '23,15')
		await user.click(screen.getByRole('button', { name: 'Search' }))

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

	it('should search sorted by date descending by default', async () => {
		const user = userEvent.setup()
		const onSearch = vi.fn()

		render(<SearchExpensesFilters categories={categories} onSearch={onSearch} />)

		await user.click(screen.getByRole('button', { name: 'Search' }))

		expect(onSearch.mock.calls[0][0].sortBy).toBe('date')
		expect(onSearch.mock.calls[0][0].sortDirection).toBe('desc')
	})

	it('should collapse the filters after searching, and expand them again on demand', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		const toggle = screen.getByRole('button', { name: 'Filters' })
		expect(toggle).toHaveAttribute('aria-expanded', 'true')

		await user.click(screen.getByRole('button', { name: 'Search' }))
		expect(screen.getByRole('button', { name: 'All categories' })).toHaveAttribute('aria-expanded', 'false')

		await user.click(screen.getByRole('button', { name: 'All categories' }))
		expect(screen.getByRole('button', { name: 'All categories' })).toHaveAttribute('aria-expanded', 'true')
	})

	it('should point the toggle button at the collapsed region via aria-controls', () => {
		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		const toggle = screen.getByRole('button', { name: 'Filters' })
		const panelId = toggle.getAttribute('aria-controls')

		expect(panelId).toBeTruthy()
		expect(document.getElementById(panelId)).toBeVisible()
	})

	it('should summarize the searched filters as the toggle button label', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		await user.selectOptions(screen.getByLabelText('Category'), 'category-id-1')
		await user.type(screen.getByLabelText('Min amount'), '10')

		expect(screen.getByRole('button', { name: 'Filters' })).toBeVisible()

		await user.click(screen.getByRole('button', { name: 'Search' }))

		expect(screen.getByRole('button', { name: 'Private vehicles · from 10\u00a0€' })).toHaveAttribute('aria-expanded', 'false')
	})

	it('should keep summarizing the last search while its filters are being changed', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		await user.selectOptions(screen.getByLabelText('Category'), 'category-id-1')
		await user.click(screen.getByRole('button', { name: 'Search' }))
		await user.click(screen.getByRole('button', { name: 'Private vehicles' }))
		await user.selectOptions(screen.getByLabelText('Category'), 'category-id-2')

		expect(screen.getByRole('button', { name: 'Private vehicles' })).toBeVisible()
		expect(screen.queryByRole('button', { name: 'Home' })).not.toBeInTheDocument()
	})

	it('should say the results are from the previous search while the filters have unsearched changes', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		await user.click(screen.getByRole('button', { name: 'Search' }))
		await user.click(screen.getByRole('button', { name: 'All categories' }))

		expect(screen.queryByText('The results below are still from the previous search')).not.toBeInTheDocument()

		await user.selectOptions(screen.getByLabelText('Category'), 'category-id-2')

		expect(screen.getByRole('status')).toHaveTextContent('The results below are still from the previous search')
	})

	it('should not mention a previous search before the first one', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		await user.selectOptions(screen.getByLabelText('Category'), 'category-id-2')

		expect(screen.queryByText('The results below are still from the previous search')).not.toBeInTheDocument()
	})

	it('should give the date fields an accessible name reaching the real input', () => {
		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		expect(screen.getByLabelText('From')).toBeVisible()
		expect(screen.getByLabelText('To')).toBeVisible()
	})

	it('should keep the date fields read only, so a typed date can never be silently discarded', () => {
		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		expect(screen.getByLabelText('From')).toHaveAttribute('readonly')
		expect(screen.getByLabelText('To')).toHaveAttribute('readonly')
	})

	it('should open the calendar when a date field is tapped', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		expect(screen.queryByRole('grid')).not.toBeInTheDocument()

		await user.click(screen.getByLabelText('From'))

		expect(screen.getByRole('grid')).toBeVisible()
	})

	it('should reach onSearch with a Date when a day is picked from the calendar', async () => {
		const user = userEvent.setup()
		const onSearch = vi.fn()

		render(<SearchExpensesFilters categories={categories} onSearch={onSearch} />)

		await user.click(screen.getByLabelText('From'))
		await user.click(screen.getAllByRole('gridcell')[15])
		await user.click(screen.getByRole('button', { name: 'Search' }))

		expect(onSearch).toHaveBeenCalledTimes(1)
		expect(onSearch.mock.calls[0][0].startDate).toBeInstanceOf(Date)
	})

	it('should disable the Search button and show a message when an amount is not a valid number', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		await user.type(screen.getByLabelText('Min amount'), 'abc')

		expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled()
		expect(screen.getByText('Amount must be a number using a decimal point or comma')).toBeVisible()
	})

	it('should mark only the amount that is not a number as invalid, described by the message', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		await user.type(screen.getByLabelText('Min amount'), 'abc')

		expect(screen.getByLabelText('Min amount')).toBeInvalid()
		expect(screen.getByLabelText('Min amount')).toHaveAccessibleDescription('Amount must be a number using a decimal point or comma')
		expect(screen.getByLabelText('Max amount')).toBeValid()
	})

	it('should disable the Search button and mark both amounts when the minimum is more than the maximum', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		await user.type(screen.getByLabelText('Min amount'), '200')
		await user.type(screen.getByLabelText('Max amount'), '100')

		expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled()
		expect(screen.getByLabelText('Min amount')).toHaveAccessibleDescription('Min amount can\'t be more than max amount')
		expect(screen.getByLabelText('Max amount')).toHaveAccessibleDescription('Min amount can\'t be more than max amount')
	})

	it('should allow searching once the maximum is raised to the minimum', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		await user.type(screen.getByLabelText('Min amount'), '200')
		await user.type(screen.getByLabelText('Max amount'), '100')
		await user.clear(screen.getByLabelText('Max amount'))
		await user.type(screen.getByLabelText('Max amount'), '200')

		expect(screen.getByRole('button', { name: 'Search' })).not.toBeDisabled()
		expect(screen.queryByText('Min amount can\'t be more than max amount')).not.toBeInTheDocument()
	})

	it('should give each calendar button its own name', () => {
		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		expect(screen.getByRole('button', { name: 'Choose From date' })).toBeVisible()
		expect(screen.getByRole('button', { name: 'Choose To date' })).toBeVisible()
	})

	it('should not let the To date be earlier than the From date', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		await user.click(screen.getByLabelText('From'))
		await user.click(screen.getAllByRole('gridcell')[15])
		await user.click(screen.getByLabelText('To'))

		// The From calendar stays mounted, so the days are looked up in the calendar the To field owns
		const toCalendar = document.getElementById(screen.getByLabelText('To').getAttribute('aria-owns'))
		await user.click(within(toCalendar).getAllByRole('gridcell')[0])

		expect(screen.getByLabelText('To')).toHaveValue('')
	})

	it('should offer to clear a date only once it is set, and clear it', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		expect(screen.queryByRole('button', { name: 'Clear From date' })).not.toBeInTheDocument()

		await user.click(screen.getByLabelText('From'))
		await user.click(screen.getAllByRole('gridcell')[15])

		expect(screen.getByLabelText('From')).not.toHaveValue('')

		await user.click(screen.getByRole('button', { name: 'Clear From date' }))

		expect(screen.getByLabelText('From')).toHaveValue('')
		expect(screen.queryByRole('button', { name: 'Clear From date' })).not.toBeInTheDocument()
	})

	it('should offer to reset the filters only once one has changed', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		expect(screen.queryByRole('button', { name: 'Reset filters' })).not.toBeInTheDocument()

		await user.selectOptions(screen.getByLabelText('Sort by'), 'quantity')

		expect(screen.getByRole('button', { name: 'Reset filters' })).toBeVisible()
	})

	it('should put every filter back to its initial value on reset', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		await user.selectOptions(screen.getByLabelText('Category'), 'category-id-1')
		await user.type(screen.getByLabelText('Max amount'), '50')
		await user.selectOptions(screen.getByLabelText('Order'), 'asc')
		await user.click(screen.getByRole('button', { name: 'Reset filters' }))

		expect(screen.getByLabelText('Category')).toHaveValue('')
		expect(screen.getByLabelText('Max amount')).toHaveValue('')
		expect(screen.getByLabelText('Order')).toHaveValue('desc')
	})

	it('should keep the Search button enabled when the amount is a valid number', async () => {
		const user = userEvent.setup()

		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		await user.type(screen.getByLabelText('Min amount'), '23,15')

		expect(screen.getByRole('button', { name: 'Search' })).not.toBeDisabled()
		expect(screen.queryByText('Amount must be a number using a decimal point or comma')).not.toBeInTheDocument()
	})

	it('should keep the Search button enabled when the amount is left empty', () => {
		render(<SearchExpensesFilters categories={categories} onSearch={vi.fn()} />)

		expect(screen.getByRole('button', { name: 'Search' })).not.toBeDisabled()
		expect(screen.queryByText('Amount must be a number using a decimal point or comma')).not.toBeInTheDocument()
	})
})
