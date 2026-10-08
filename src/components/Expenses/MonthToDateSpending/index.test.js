import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import { MonthToDateSpending } from './'

const renderMonthToDateSpending = (props) => render(
	<MemoryRouter>
		<MonthToDateSpending monthName='October' currencyISO='EUR' {...props} />
	</MemoryRouter>
)

describe('MonthToDateSpending', () => {
	it('shows what was spent and what went to savings and investments this month', () => {
		renderMonthToDateSpending({ spent: 412.3, savingsAndInvestments: 300 })

		expect(screen.getByText('Spent in October')).toBeVisible()
		expect(screen.getByText('412.3 €')).toBeVisible()
		expect(screen.getByText('Savings & investments in October: 300 €')).toBeVisible()
	})

	it('still shows savings and investments when nothing went there this month', () => {
		renderMonthToDateSpending({ spent: 0, savingsAndInvestments: 0 })

		expect(screen.getByText('Savings & investments in October: 0 €')).toBeVisible()
	})

	it('links to the monthly spending overview', () => {
		renderMonthToDateSpending({ spent: 412.3, savingsAndInvestments: 300 })

		expect(screen.getByRole('link', { name: /spent in october/i })).toHaveAttribute('href', '/spending/monthly')
	})
})
