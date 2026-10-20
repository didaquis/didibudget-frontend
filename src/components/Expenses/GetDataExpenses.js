import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { Spinner } from '../Spinner'
import { ErrorAlert } from '../ErrorAlert'
import { GraphExpensesData } from './GraphExpensesData'
import { CategoryType } from '../SavingsAndInvestments/utils'

import { LIST_ALL_EXPENSES, GET_EXPENSES_AVERAGES } from '../../gql/queries/expenses'
import { formatIsoMonth } from '../../utils/utils'

export const GetDataExpenses = () => {
	// Read the clock once, so a render in another month does not ask for other averages
	const [currentMonth] = useState(() => formatIsoMonth(new Date()))
	const listAllExpensesQuery = useQuery(LIST_ALL_EXPENSES, { fetchPolicy: 'no-cache' })
	const expensesAverageQuery = useQuery(GET_EXPENSES_AVERAGES, { variables: { excludedCategoryTypes: [], currentMonth }, fetchPolicy: 'no-cache' })
	const expensesAverageExcludingSavingsQuery = useQuery(GET_EXPENSES_AVERAGES, { variables: { excludedCategoryTypes: [CategoryType.INVESTMENT, CategoryType.PENSION_PLAN], currentMonth }, fetchPolicy: 'no-cache' })


	if (listAllExpensesQuery.loading || expensesAverageQuery.loading || expensesAverageExcludingSavingsQuery.loading) { return <Spinner /> }
	if (listAllExpensesQuery.error) { return <ErrorAlert errorMessage={listAllExpensesQuery.error.message} /> }
	if (expensesAverageQuery.error) { return <ErrorAlert errorMessage={expensesAverageQuery.error.message} /> }
	if (expensesAverageExcludingSavingsQuery.error) { return <ErrorAlert errorMessage={expensesAverageExcludingSavingsQuery.error.message} /> }

	return <GraphExpensesData graphData={listAllExpensesQuery.data.getExpenses} averageData={expensesAverageQuery.data} averageDataExcludingSavings={expensesAverageExcludingSavingsQuery.data} />
}