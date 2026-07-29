import { useQuery } from '@apollo/client'

import { Spinner } from '../Spinner'
import { ErrorAlert } from '../ErrorAlert'
import { AddExpenseForm } from './AddExpenseForm'

import { LIST_EXPENSE_CATEGORIES, GET_MOST_USED_EXPENSE_CATEGORIES } from '../../gql/queries/expenseCategories'

const DAYS_OF_HISTORY = 90
const NUMBER_OF_FREQUENT_CATEGORIES = 6

export const GetAddExpenseData = () => {
	const categories = useQuery(LIST_EXPENSE_CATEGORIES, { fetchPolicy: 'no-cache' })
	const frequent = useQuery(GET_MOST_USED_EXPENSE_CATEGORIES, {
		variables: { days: DAYS_OF_HISTORY, limit: NUMBER_OF_FREQUENT_CATEGORIES },
		fetchPolicy: 'no-cache'
	})

	if (categories.loading || frequent.loading) { return <Spinner /> }
	if (categories.error) { return <ErrorAlert errorMessage={categories.error.message} /> }

	if (frequent.error) {
		console.error('Failed to load the most used expense categories:', frequent.error.message)
	}

	const frequentCategories = frequent.error ? [] : frequent.data.getMostUsedExpenseCategories

	return <AddExpenseForm categories={categories.data.getExpenseCategory} frequentCategories={frequentCategories} />
}
