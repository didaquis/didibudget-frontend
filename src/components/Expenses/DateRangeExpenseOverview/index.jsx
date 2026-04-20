import PropTypes from 'prop-types'

import { getDetailedExpensesGroupedFromRange } from '../utils'

import { ErrorAlert } from '../../ErrorAlert'
import { DetailedExpensesGroup } from '../DetailedExpensesGroup'

export const DateRangeExpenseOverview = ({ startDate, endDate, expenses, categories }) => {
	const expensesGroupedData = getDetailedExpensesGroupedFromRange(expenses, startDate, endDate)

	if (!expensesGroupedData) {
		const errorMessage = 'Not enough data'
		return <ErrorAlert errorMessage={errorMessage} />
	}

	return (
		<section className="pt-4">
			<DetailedExpensesGroup expensesGroupData={expensesGroupedData} categories={categories} />
		</section>
	)
}


DateRangeExpenseOverview.propTypes = {
	startDate: PropTypes.object.isRequired,
	endDate: PropTypes.object.isRequired,
	expenses: PropTypes.arrayOf(
		PropTypes.shape({
			date: PropTypes.string.isRequired,
			uuid: PropTypes.string.isRequired,
			category: PropTypes.string.isRequired,
			subcategory: PropTypes.string,
			quantity: PropTypes.number.isRequired,
			currencyISO: PropTypes.string.isRequired
		})
	),
	categories: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			subcategories: PropTypes.arrayOf(
				PropTypes.shape({
					_id: PropTypes.string.isRequired,
					name: PropTypes.string.isRequired,
					uuid: PropTypes.string.isRequired
				})
			),
			uuid: PropTypes.string.isRequired
		})
	)
}
