import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import { ExpensesDropdown } from './ExpensesDropdown'

const MENU_ITEMS = [
	['Add spending', '/spending/add'],
	['Spending overview', '/spending/overview'],
	['Spending list', '/spending/list'],
	['Monthly spending overview', '/spending/monthly'],
	['Yearly spending overview', '/spending/yearly'],
	['Monthly spending breakdown', '/spending/monthly-breakdown'],
	['Spending search', '/spending/search']
]

describe('ExpensesDropdown', () => {
	it.each(MENU_ITEMS)('links %s to %s', (label, path) => {
		render(<MemoryRouter><ExpensesDropdown /></MemoryRouter>)

		expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', path)
	})

	it('opens the menu with a named button', () => {
		render(<MemoryRouter><ExpensesDropdown /></MemoryRouter>)

		expect(screen.getByRole('button', { name: 'Spending' })).toBeVisible()
	})
})
