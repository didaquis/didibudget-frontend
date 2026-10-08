import { render, screen } from '@testing-library/react'

import { DateRangeExpenseOverview } from './'

describe('DateRangeExpenseOverview', () => {
	it('should say no spending is recorded in the date range when there is none', () => {
		render(<DateRangeExpenseOverview startDate={new Date(2026, 0, 1)} endDate={new Date(2026, 0, 31)} expenses={[]} categories={[]} />)

		expect(screen.getByRole('status')).toHaveTextContent('No spending recorded in this date range')
	})
})
