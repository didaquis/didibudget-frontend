import { useQuery } from '@apollo/client'

import { Spinner } from '../Spinner'
import { ErrorAlert } from '../ErrorAlert'

import { GET_EXPENSES_SUM_BY_TYPE } from '../../gql/queries/expenses'

export const GetExpensesSumByType = () => {
	const { loading, error, data } = useQuery(GET_EXPENSES_SUM_BY_TYPE, { variables: { categoryType: 'patata' }, fetchPolicy: 'no-cache' })

	if (loading) return <Spinner />
	if (error) return <ErrorAlert errorMessage={error.message} />

	console.log(data)

	return <div>Expenses sum by type</div>
	//return <GraphMonthlyBalance data={data.getMonthlyBalances} />
}