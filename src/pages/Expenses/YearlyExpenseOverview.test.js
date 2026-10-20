import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import YearlyExpenseOverview from './YearlyExpenseOverview'
import { LIST_EXPENSES_BETWEEN_DATES_AND_CATEGORIES } from '../../gql/queries/expenses'

const emptyRangeMock = (startDate, endDate) => {
	return {
		request: { query: LIST_EXPENSES_BETWEEN_DATES_AND_CATEGORIES, variables: { startDate, endDate } },
		result: { data: { getExpensesBetweenDates: [], getExpenseCategory: [] } }
	}
}

describe('YearlyExpenseOverview', () => {
	beforeEach(() => {
		vi.useFakeTimers({ toFake: ['Date'] })
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('asks for the days of the previous calendar year in January', async () => {
		vi.setSystemTime(new Date(2026, 0, 5, 18, 0))
		render(
			<MockedProvider mocks={[emptyRangeMock('2025-01-01', '2025-12-31')]}>
				<YearlyExpenseOverview />
			</MockedProvider>
		)

		expect(await screen.findByText('No spending recorded in this date range.')).toBeVisible()
	})
})
