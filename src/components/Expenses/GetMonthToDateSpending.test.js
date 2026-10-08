import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { MockedProvider } from '@apollo/client/testing'

import { GetMonthToDateSpending } from './GetMonthToDateSpending'
import { GET_MONTH_TO_DATE_SPENDING } from '../../gql/queries/expenses'

const expense = (uuid, category, quantity) => ({ __typename: 'Expense', uuid, category, quantity, currencyISO: 'EUR' })

const monthMock = {
	request: { query: GET_MONTH_TO_DATE_SPENDING },
	variableMatcher: () => true,
	result: {
		data: {
			getExpensesBetweenDates: [
				expense('expense-1', 'food-id', 12.1),
				expense('expense-2', 'fuel-id', 30.2),
				expense('expense-3', 'fund-id', 200),
				expense('expense-4', 'pension-id', 100)
			],
			getExpenseCategory: [
				{ __typename: 'ExpenseCategory', _id: 'food-id', categoryType: 'expense' },
				{ __typename: 'ExpenseCategory', _id: 'fuel-id', categoryType: 'expense' },
				{ __typename: 'ExpenseCategory', _id: 'fund-id', categoryType: 'investment' },
				{ __typename: 'ExpenseCategory', _id: 'pension-id', categoryType: 'pension_plan' }
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

	it('keeps savings and investments out of the spending of the month', async () => {
		renderWithMocks([monthMock])

		expect(await screen.findByText('42.3 €')).toBeVisible()
		expect(screen.getByText('Savings & investments: 300 €')).toBeVisible()
	})

	it('asks for the spending of the month only once', async () => {
		vi.useRealTimers()
		const newData = vi.fn(() => monthMock.result)
		renderWithMocks([{ ...monthMock, newData, maxUsageCount: Number.POSITIVE_INFINITY }])

		await screen.findByText('42.3 €')
		await new Promise(resolve => setTimeout(resolve, 50))

		expect(newData).toHaveBeenCalledTimes(1)
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
