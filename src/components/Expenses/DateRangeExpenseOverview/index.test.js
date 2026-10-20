import { render, screen } from '@testing-library/react'

import { DateRangeExpenseOverview } from './'

describe('DateRangeExpenseOverview', () => {
	it('should say no spending is recorded in the date range when there is none', () => {
		render(<DateRangeExpenseOverview startDate='2026-01-01' endDate='2026-01-31' expenses={[]} categories={[]} />)

		expect(screen.getByRole('status')).toHaveTextContent('No spending recorded in this date range.')
	})
})
