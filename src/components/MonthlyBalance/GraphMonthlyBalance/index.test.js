import { cloneElement } from 'react'
import { render, screen } from '@testing-library/react'

import { GraphMonthlyBalance } from '.'

// jsdom has no layout, so the real container measures 0×0 and draws nothing
vi.mock('recharts', async (importOriginal) => ({
	...await importOriginal(),
	ResponsiveContainer: ({ children }) => cloneElement(children, { width: 400, height: 300 })
}))

const balances = Array.from({ length: 25 }, (_, i) => ({
	year: 2024 + Math.floor(i / 12),
	month: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'][i % 12],
	balance: 1000 + i
}))

describe('GraphMonthlyBalance', () => {
	it('names each chart as an image of what it plots', () => {
		render(<GraphMonthlyBalance data={balances} />)

		expect(screen.getByRole('img', { name: 'Line chart of the monthly balance over the last 12 months' })).toBeVisible()
		expect(screen.getByRole('img', { name: 'Line chart of the monthly balance over the last 24 months' })).toBeVisible()
		expect(screen.getByRole('img', { name: 'Line chart of the monthly balance since January 2024' })).toBeVisible()
	})

	it('keeps the charts out of the tab order', () => {
		render(<GraphMonthlyBalance data={balances} />)

		screen.getAllByRole('img').forEach(chart => expect(chart).not.toHaveAttribute('tabindex'))
	})
})
