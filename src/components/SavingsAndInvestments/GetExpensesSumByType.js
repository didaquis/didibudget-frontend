import { useQuery } from '@apollo/client'

import { Spinner } from '../Spinner'
import { ErrorAlert } from '../ErrorAlert'

import { GET_EXPENSES_SUM_BY_TYPE } from '../../gql/queries/expenses'
import { CategoryType } from '../SavingsAndInvestments/utils'

export const GetExpensesSumByType = () => {
	const pensionPlanQuery = useQuery(GET_EXPENSES_SUM_BY_TYPE, { variables: { categoryType: CategoryType.PENSION_PLAN }, fetchPolicy: 'no-cache' })

	const investmentsPlanQuery = useQuery(GET_EXPENSES_SUM_BY_TYPE, { variables: { categoryType: CategoryType.INVESTMENT }, fetchPolicy: 'no-cache' })

	if (pensionPlanQuery.loading || investmentsPlanQuery.loading) return <Spinner />
	if (pensionPlanQuery.error) return <ErrorAlert errorMessage={pensionPlanQuery.error.message} />
    if (investmentsPlanQuery.error) return <ErrorAlert errorMessage={investmentsPlanQuery.error.message} />

	console.log(pensionPlanQuery.data.getExpensesSumByType)
	console.log(investmentsPlanQuery.data.getExpensesSumByType)

	return <div>Expenses sum by type</div>
	//return <GraphMonthlyBalance data={data.getMonthlyBalances} />
}