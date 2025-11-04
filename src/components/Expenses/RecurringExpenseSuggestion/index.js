// RecurringExpenseSuggestion


import PropTypes from 'prop-types'

export const RecurringExpenseSuggestion = ({ suggestion }) => {
	// TODO: remove console logs
	console.log(suggestion)

	return (
		<p>{ suggestion.uuid }</p>
	)
}


RecurringExpenseSuggestion.propTypes = {
	suggestion: PropTypes.shape({
		uuid: PropTypes.string.isRequired,
		suggestedExpense: PropTypes.shape({
			category: PropTypes.string.isRequired,
			categoryName: PropTypes.string.isRequired,
			categoryEmojis: PropTypes.arrayOf(PropTypes.string).isRequired,
			subcategory: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.oneOf([null])
			]),
			subcategoryName: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.oneOf([null])
			]),
			subcategoryEmojis: PropTypes.arrayOf(PropTypes.string),
			quantity: PropTypes.number.isRequired,
		}),
	}).isRequired
}
