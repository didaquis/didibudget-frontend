import PropTypes from 'prop-types'

import { getDetailedExpensesPerMonth } from '../utils'

import { ErrorAlert } from '../../ErrorAlert'
import { DetailedExpensesGroup } from '../DetailedExpensesGroup'

export const AnalysisOfExpenses = ( { expenses, categories } ) => {
	if (expenses.length) {
		const expensesData = getDetailedExpensesPerMonth(expenses)
		const reversedData = expensesData.slice(0).reverse()

		return (
			<section className="pt-4">
				{
					reversedData.map(monthData => {
						return (
							<DetailedExpensesGroup expensesGroupData={monthData} categories={categories} key={monthData.groupTitle} />
						)
					})
				}
			</section>
		)
	} else {
		const errorMessage = 'Not enough data'
		return <ErrorAlert errorMessage={errorMessage} />
	}
}


AnalysisOfExpenses.propTypes = {
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
