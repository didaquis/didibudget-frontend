import { Fragment } from 'react'
import PropTypes from 'prop-types'


import { PageSubTitle } from '../../PageSubTitle'


export const ViewGetSavingsAndInvestments = ({data}) => {	
	return (
		<Fragment>
			<PageSubTitle text="Average spending: (excluding the current month)"/>
			<p>se muestra el componente presentacional</p>
		</Fragment>
	)
}

ViewGetSavingsAndInvestments.propTypes = {
	data: PropTypes.array.isRequired,
}
/**
tartDate: PropTypes.object.isRequired,
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
 */
