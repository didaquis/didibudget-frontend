import PropTypes from 'prop-types'

export const RecurringExpenseSuggestionsOverview = ({ suggestions, categories }) => {
	console.log(suggestions)
	console.log(categories)
	
	return (
		<section className="pt-4">
		
		</section>
	)
}


RecurringExpenseSuggestionsOverview.propTypes = {
	suggestions: PropTypes.arrayOf(
		PropTypes.shape({
			uuid: PropTypes.string.isRequired,
			suggestedExpense: PropTypes.shape({
				category: PropTypes.string.isRequired,
				subcategory: PropTypes.string,
				quantity: PropTypes.number.isRequired,
			}),
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
