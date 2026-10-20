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

	it('keeps the same range when it renders again after midnight', async () => {
		vi.setSystemTime(new Date(2026, 0, 5, 23, 59))
		const result = vi.fn(() => {
			return { data: { getExpensesBetweenDates: [], getExpenseCategory: [] } }
		})
		const mock = { ...emptyRangeMock('2026-01-01', '2026-01-05'), result, maxUsageCount: Number.POSITIVE_INFINITY }
		const { rerender } = render(
			<MockedProvider mocks={[mock]}>
				<MonthlyExpenseOverview />
			</MockedProvider>
		)
		await screen.findByText('No spending recorded in this date range.')

		vi.setSystemTime(new Date(2026, 0, 6, 0, 1))
		rerender(
			<MockedProvider mocks={[mock]}>
				<MonthlyExpenseOverview />
			</MockedProvider>
		)

		expect(screen.getByText('No spending recorded in this date range.')).toBeVisible()
		expect(result).toHaveBeenCalledTimes(1)
	})
})
