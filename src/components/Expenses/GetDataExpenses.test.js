import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import { GetDataExpenses } from './GetDataExpenses'
import { LIST_ALL_EXPENSES, GET_EXPENSES_AVERAGES } from '../../gql/queries/expenses'
import { CategoryType } from '../SavingsAndInvestments/utils'

vi.mock('./GraphExpensesData', () => {
	const React = require('react')
	return {
		GraphExpensesData: ({ averageData }) => React.createElement(
			'p',
			null,
			`3-month average: ${averageData.lastThreeMonthsAverage.average} €`
		)
	}
})

const average = (value) => ({ __typename: 'ExpensesMonthlyAverage', average: value, currencyISO: 'EUR' })

const averagesData = (value) => ({
	lastThreeMonthsAverage: average(value),
	lastSixMonthsAverage: average(value),
	lastTwelveMonthsAverage: average(value),
	lastTwentyFourMonthsAverage: average(value)
})

const expensesMock = {
	request: { query: LIST_ALL_EXPENSES },
	result: { data: { getExpenses: [] } },
	maxUsageCount: Number.POSITIVE_INFINITY
}

const averagesMock = (result) => ({
	request: { query: GET_EXPENSES_AVERAGES },
	variableMatcher: () => true,
	result,
	maxUsageCount: Number.POSITIVE_INFINITY
})

describe('GetDataExpenses', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it('asks the server for the averages again every time the page opens', async () => {
		let average = 100
		const result = () => ({ data: averagesData(average) })
		const { rerender } = render(
			<MockedProvider mocks={[expensesMock, averagesMock(result)]}>
				<GetDataExpenses key="first visit" />
			</MockedProvider>
		)
		expect(await screen.findByText('3-month average: 100 €')).toBeVisible()

		average = 150
		rerender(
			<MockedProvider mocks={[expensesMock, averagesMock(result)]}>
				<GetDataExpenses key="second visit" />
			</MockedProvider>
		)

		expect(await screen.findByText('3-month average: 150 €')).toBeVisible()
	})

	it('asks for the averages up to the current month on the device calendar', async () => {
		vi.useFakeTimers({ toFake: ['Date'] })
		// 00:30 on 1 April in Madrid, still March in UTC
		vi.setSystemTime(new Date('2026-03-31T22:30:00.000Z'))
		const averagesForMonth = (excludedCategoryTypes) => ({
			request: { query: GET_EXPENSES_AVERAGES, variables: { excludedCategoryTypes, currentMonth: '2026-04' } },
			result: { data: averagesData(100) }
		})

		render(
			<MockedProvider mocks={[expensesMock, averagesForMonth([]), averagesForMonth([CategoryType.INVESTMENT, CategoryType.PENSION_PLAN])]}>
				<GetDataExpenses />
			</MockedProvider>
		)

		expect(await screen.findByText('3-month average: 100 €')).toBeVisible()
	})
})
