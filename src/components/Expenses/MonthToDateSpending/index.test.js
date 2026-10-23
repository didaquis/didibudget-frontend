import { render, screen } from '@testing-library/react'

import { MonthToDateSpending } from './'

const renderMonthToDateSpending = (props) => render(
	<MonthToDateSpending monthName='October' currencyISO='EUR' {...props} />
)

describe('MonthToDateSpending', () => {
	it('shows what was spent this month', () => {
		renderMonthToDateSpending({ spent: 412.3 })

		expect(screen.getByText('Spent in October')).toBeVisible()
		expect(screen.getByText('412.3 €')).toBeVisible()
	})

	it('only shows the figures, without leading anywhere', () => {
		renderMonthToDateSpending({ spent: 412.3 })

		expect(screen.queryByRole('link')).not.toBeInTheDocument()
	})
})
