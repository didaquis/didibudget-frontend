import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ErrorAlert } from '../ErrorAlert'
import { MonthToDateSpending, MonthToDateSpendingLoading } from './MonthToDateSpending'
import { CategoryType } from '../SavingsAndInvestments/utils'
import { trimDecimalPoints } from '../../utils/utils'

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
	return { now, startDate: new Date(now.getFullYear(), now.getMonth(), 1) }
}

export const GetMonthToDateSpending = () => {
	// Dates built on every render would be new variables each time and refetch forever
	const [{ now, startDate }] = useState(getMonthToDate)

	const { loading, error, data } = useQuery(GET_MONTH_TO_DATE_SPENDING, { variables: { startDate, endDate: now }, fetchPolicy: 'no-cache' })

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
