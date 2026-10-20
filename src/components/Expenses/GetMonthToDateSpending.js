import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ErrorAlert } from '../ErrorAlert'
import { MonthToDateSpending, MonthToDateSpendingLoading } from './MonthToDateSpending'
import { CategoryType } from '../SavingsAndInvestments/utils'
import { getMonthToDateRange, trimDecimalPoints } from '../../utils/utils'

import { GET_MONTH_TO_DATE_SPENDING } from '../../gql/queries/expenses'

const sumBySpendingOrSavings = (expenses, categories) => {
	const categoryTypes = new Map(categories.map(category => [category._id, category.categoryType]))

	return expenses.reduce((totals, expense) => {
		const isSpending = categoryTypes.get(expense.category) === CategoryType.EXPENSE
		const key = isSpending ? 'spent' : 'savingsAndInvestments'
		return { ...totals, [key]: totals[key] + expense.quantity }
	}, { spent: 0, savingsAndInvestments: 0 })
}

const getMonthToDate = () => {
	const now = new Date()
	return { now, ...getMonthToDateRange(now) }
}

export const GetMonthToDateSpending = () => {
	// Read the clock once, so a render after midnight does not ask for another range
	const [{ now, startDate, endDate }] = useState(getMonthToDate)

	const { loading, error, data } = useQuery(GET_MONTH_TO_DATE_SPENDING, { variables: { startDate, endDate }, fetchPolicy: 'no-cache' })

	const monthName = now.toLocaleString('en', { month: 'long' })

	if (loading) { return <MonthToDateSpendingLoading monthName={monthName} /> }
	if (error) { return <ErrorAlert errorMessage={error.message} /> }

	const expenses = data.getExpensesBetweenDates
	const { spent, savingsAndInvestments } = sumBySpendingOrSavings(expenses, data.getExpenseCategory)

	return (
		<MonthToDateSpending
			monthName={monthName}
			spent={trimDecimalPoints(spent)}
			savingsAndInvestments={trimDecimalPoints(savingsAndInvestments)}
			currencyISO={expenses[0]?.currencyISO ?? 'EUR'}
		/>
	)
}
