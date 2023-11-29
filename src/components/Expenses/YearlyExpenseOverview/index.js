import PropTypes from 'prop-types'

//import { getDetailedExpensesPerMonth } from '../utils'

import { ErrorAlert } from '../../ErrorAlert'
import { DetailedExpensesGroup } from '../DetailedExpensesGroup'

export const YearlyExpenseOverview = ( { expenses, categories } ) => {
	if (expenses.length) {
		// const expensesData = getDetailedExpensesPerMonth(expenses) // TODO: Debo preparar los datos para enviarlos al componente
		// const reversedData = expensesData.slice(0).reverse()

		const yearlyExpensesData = {
			groupTitle: 'foo',
			groupTotal: 0,
			perCategory: []
		} 

		return (
			<section className="pt-4">
				<DetailedExpensesGroup expensesGroupData={yearlyExpensesData} categories={categories} key={yearlyExpensesData.groupTitle} />
			</section>
		)
	} else {
		const errorMessage = 'Not enough data'
		return <ErrorAlert errorMessage={errorMessage} />
	}
}


YearlyExpenseOverview.propTypes = {
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
