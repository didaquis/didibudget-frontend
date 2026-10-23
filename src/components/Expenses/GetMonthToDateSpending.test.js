import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { MockedProvider } from '@apollo/client/testing'

import { GetMonthToDateSpending } from './GetMonthToDateSpending'
import { GET_MONTH_TO_DATE_SPENDING } from '../../gql/queries/expenses'

const expense = (uuid, quantity) => ({ __typename: 'Expense', uuid, quantity, currencyISO: 'EUR' })

const monthMock = {
	request: { query: GET_MONTH_TO_DATE_SPENDING },
	variableMatcher: () => true,
	result: {
		data: {
			getExpensesBetweenDates: [
				expense('expense-1', 12.1),
				expense('expense-2', 30.2),
				expense('expense-3', 200),
				expense('expense-4', 100)
			]
		}
	}
}

const failingMock = {
	request: { query: GET_MONTH_TO_DATE_SPENDING },
	variableMatcher: () => true,
	error: new Error('Spending is not available')
}

const renderWithMocks = (mocks) => render(
	<MockedProvider mocks={mocks}>
		<MemoryRouter>
			<GetMonthToDateSpending />
		</MemoryRouter>
	</MockedProvider>
)

describe('GetMonthToDateSpending', () => {
	beforeEach(() => {
		vi.useFakeTimers({ toFake: ['Date'] })
		vi.setSystemTime(new Date('2026-10-08T12:00:00'))
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('asks for the days from the 1st to today on the device calendar', async () => {
		// 00:30 on 1 March in Madrid, still 28 February in UTC
		vi.setSystemTime(new Date('2026-02-28T23:30:00.000Z'))
		const { variableMatcher, ...mockWithoutMatcher } = monthMock
		renderWithMocks([{ ...mockWithoutMatcher, request: { ...monthMock.request, variables: { startDate: '2026-03-01', endDate: '2026-03-01' } } }])

		expect(await screen.findByText('342.3 €')).toBeVisible()
	})

	it('adds up everything recorded this month, savings and investments included', async () => {
		renderWithMocks([monthMock])

		expect(await screen.findByText('342.3 €')).toBeVisible()
		expect(screen.queryByText(/Put aside/)).not.toBeInTheDocument()
	})

	it('asks for the spending of the month only once', async () => {
		vi.useRealTimers()
		const result = vi.fn(() => monthMock.result)
		renderWithMocks([{ ...monthMock, result, maxUsageCount: Number.POSITIVE_INFINITY }])

		await screen.findByText('342.3 €')
		await new Promise(resolve => setTimeout(resolve, 50))

		expect(result).toHaveBeenCalledTimes(1)
	})

	it('tells that the spending of the month is loading', () => {
		renderWithMocks([monthMock])

		expect(screen.getByRole('status')).toHaveTextContent('Loading this month…')
	})

	it('names the month while its figures are still loading', () => {
		renderWithMocks([monthMock])

		expect(screen.getByText('Spent in October')).toBeVisible()
	})

	it('shows the error when the spending of the month cannot be loaded', async () => {
		renderWithMocks([failingMock])

		expect(await screen.findByRole('alert')).toHaveTextContent('Spending is not available')
	})
})
