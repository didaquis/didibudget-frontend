import { useQuery } from '@apollo/client'
import PropTypes from 'prop-types'

import { Spinner } from '../Spinner'
import { ErrorAlert } from '../ErrorAlert'
import { DateRangeExpenseOverview } from './DateRangeExpenseOverview'

import { LIST_EXPENSES_BETWEEN_DATES_AND_CATEGORIES } from '../../gql/queries/expenses'

export const GetYearlyExpenseOverview = ({ startDate, endDate }) => {

	const { loading, error, data } = useQuery(LIST_EXPENSES_BETWEEN_DATES_AND_CATEGORIES, { variables: { startDate: startDate, endDate: endDate}, fetchPolicy: 'no-cache' })

	if (loading) return <Spinner />
	if (error) return <ErrorAlert errorMessage={error.message} />

	return <DateRangeExpenseOverview startDate={startDate} endDate={endDate} expenses={data.getExpensesBetweenDates} categories={data.getExpenseCategory} />
}

GetYearlyExpenseOverview.propTypes = {
	startDate: PropTypes.object.isRequired,
	endDate: PropTypes.object.isRequired,
}