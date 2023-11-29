import { useQuery } from '@apollo/client'
import PropTypes from 'prop-types'

import { Spinner } from '../Spinner'
import { ErrorAlert } from '../ErrorAlert'
import { YearlyExpenseOverview } from './YearlyExpenseOverview'

import { LIST_YEARLY_EXPENSES_AND_CATEGORIES } from '../../gql/queries/expenses'

export const GetYearlyExpenseOverview = ({ startDate, endDate }) => {

	const { loading, error, data } = useQuery(LIST_YEARLY_EXPENSES_AND_CATEGORIES, { variables: { startDate: startDate, endDate: endDate}, fetchPolicy: 'no-cache' })

	if (loading) return <Spinner />
	if (error) return <ErrorAlert errorMessage={error.message} />

	return <YearlyExpenseOverview expenses={data.getExpensesBetweenDates} categories={data.getExpenseCategory} />
}

GetYearlyExpenseOverview.propTypes = {
	startDate: PropTypes.string.isRequired,
	endDate: PropTypes.string.isRequired,
}