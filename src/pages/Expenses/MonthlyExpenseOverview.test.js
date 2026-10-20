import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import MonthlyExpenseOverview from './MonthlyExpenseOverview'
import { LIST_EXPENSES_BETWEEN_DATES_AND_CATEGORIES } from '../../gql/queries/expenses'

const emptyRangeMock = (startDate, endDate) => {
	return {
		request: { query: LIST_EXPENSES_BETWEEN_DATES_AND_CATEGORIES, variables: { startDate, endDate } },
		result: { data: { getExpensesBetweenDates: [], getExpenseCategory: [] } }
	}
}

describe('MonthlyExpenseOverview', () => {
	beforeEach(() => {
		vi.useFakeTimers({ toFake: ['Date'] })
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('asks for the days from the 1st of the month to today', async () => {
		vi.setSystemTime(new Date(2026, 0, 5, 18, 0))
		render(
			<MockedProvider mocks={[emptyRangeMock('2026-01-01', '2026-01-05')]}>
				<MonthlyExpenseOverview />
			</MockedProvider>
		)

		expect(await screen.findByText('No spending recorded in this date range.')).toBeVisible()
	})
})
