import { render, screen } from '@testing-library/react'

import { MonthToDateSpending } from './'

const renderMonthToDateSpending = (props) => render(
	<MonthToDateSpending monthName='October' currencyISO='EUR' {...props} />
)

describe('MonthToDateSpending', () => {
	it('shows what was spent and what went to savings and investments this month', () => {
		renderMonthToDateSpending({ spent: 412.3, savingsAndInvestments: 300 })

		expect(screen.getByText('Spent in October')).toBeVisible()
		expect(screen.getByText('412.3 €')).toBeVisible()
		expect(screen.getByText('Savings & investments: 300 €')).toBeVisible()
	})

	it('still shows savings and investments when nothing went there this month', () => {
		renderMonthToDateSpending({ spent: 0, savingsAndInvestments: 0 })

		expect(screen.getByText('Savings & investments: 0 €')).toBeVisible()
	})

	it('only shows the figures, without leading anywhere', () => {
		renderMonthToDateSpending({ spent: 412.3, savingsAndInvestments: 300 })

		expect(screen.queryByRole('link')).not.toBeInTheDocument()
	})
})
