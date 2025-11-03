import { useQuery } from '@apollo/client'
import { getLocalDay } from '../../utils/utils'


import { Spinner } from '../Spinner'
import { ErrorAlert } from '../ErrorAlert'

import { GET_ALL_RECURRING_EXPENSE_SUGGESTIONS_AND_CATEGORIES } from '../../gql/queries/expenses'

export const GetRecurringExpenseSuggestions = () => {

	const { loading, error, data } = useQuery(GET_ALL_RECURRING_EXPENSE_SUGGESTIONS_AND_CATEGORIES, { variables: { day: getLocalDay() }, fetchPolicy: 'no-cache' })

	if (loading) return <Spinner />
	if (error) return <ErrorAlert errorMessage={error.message} />

	console.log(data)

	return <p>data is here!</p>
}
