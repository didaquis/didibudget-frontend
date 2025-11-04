import PropTypes from 'prop-types'

import { SubmitButton } from '../../SubmitButton'
import { EmojiListFromCategoryOrSubcategory } from '../../EmojiListFromCategoryOrSubcategory'

export const RecurringExpenseSuggestion = ({ suggestion }) => {
	// TODO: remove console logs
	console.log(suggestion)

	const onSubmit = (event) => {
		console.log('submit')
	}

	return (
		<div className="col-sm-6 col-md-4">
			<div className="card bg-dark border-info text-light mb-3">
				<div className="card-body">
					<h5 className="card-title">{suggestion.suggestedExpense.categoryName} <EmojiListFromCategoryOrSubcategory emojis={suggestion.suggestedExpense.categoryEmojis} /></h5>
					<h6 className="card-subtitle mb-2">{suggestion.suggestedExpense.subcategoryName} <EmojiListFromCategoryOrSubcategory emojis={suggestion.suggestedExpense.subcategoryEmojis} /></h6>
					<p className="card-text">{suggestion.suggestedExpense.quantity} EUR</p>
					<SubmitButton disabled={false} onClick={onSubmit}>Save expense</SubmitButton>
				</div>
			</div>
		</div>
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
