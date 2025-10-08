import { useQuery } from '@apollo/client'

import { Spinner } from '../Spinner'
import { ErrorAlert } from '../ErrorAlert'
import { ViewGetSavingsAndInvestments } from './ViewGetSavingsAndInvestments'

import { GET_EXPENSES_SUM_BY_TYPE } from '../../gql/queries/expenses'
import { CategoryType } from './utils'

export const GetSavingsAndInvestments = () => {
	const pensionPlanQuery = useQuery(GET_EXPENSES_SUM_BY_TYPE, { variables: { categoryType: CategoryType.PENSION_PLAN }, fetchPolicy: 'no-cache' })

	const investmentsPlanQuery = useQuery(GET_EXPENSES_SUM_BY_TYPE, { variables: { categoryType: CategoryType.INVESTMENT }, fetchPolicy: 'no-cache' })

	if (pensionPlanQuery.loading || investmentsPlanQuery.loading) return <Spinner />
	if (pensionPlanQuery.error) return <ErrorAlert errorMessage={pensionPlanQuery.error.message} />
    if (investmentsPlanQuery.error) return <ErrorAlert errorMessage={investmentsPlanQuery.error.message} />

	return <ViewGetSavingsAndInvestments data={[pensionPlanQuery.data.getExpensesSumByType, investmentsPlanQuery.data.getExpensesSumByType]} />
}