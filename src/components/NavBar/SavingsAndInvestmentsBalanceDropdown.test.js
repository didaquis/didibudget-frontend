import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import { SavingsAndInvestmentsBalanceDropdown } from './SavingsAndInvestmentsBalanceDropdown'

const MENU_ITEMS = [
	['Add monthly balance', '/monthly-balance/add'],
	['Monthly balance overview', '/monthly-balance/overview'],
	['Monthly balances list', '/monthly-balance/list'],
	['Savings & investments', '/savings-and-investments']
]

describe('SavingsAndInvestmentsBalanceDropdown', () => {
	it.each(MENU_ITEMS)('links %s to %s', (label, path) => {
		render(<MemoryRouter><SavingsAndInvestmentsBalanceDropdown /></MemoryRouter>)

		expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', path)
	})

	it('opens the menu with a named button', () => {
		render(<MemoryRouter><SavingsAndInvestmentsBalanceDropdown /></MemoryRouter>)

		expect(screen.getByRole('button', { name: 'Cash, savings & investments' })).toBeVisible()
	})
})
