import PropTypes from 'prop-types'

import { RecurringExpenseSuggestion } from '../RecurringExpenseSuggestion'

export const RecurringExpenseSuggestionsOverview = ({ suggestions }) => {
	const hasSuggestions = !!suggestions.length

	return (
		<section className="mt-4">
			<div className="card bg-dark border-info">
				<div className="card-header">
					<h4 className="mb-0 text-light">Suggestions</h4>
				</div>
				<div className="card-body pb-0">
					{!hasSuggestions ? (
						<p className="text-light">No suggestions available right now.</p>
					) : (
						<div className="row">
						{
							suggestions.map(suggestion => (
								<RecurringExpenseSuggestion key={suggestion.uuid} suggestion={suggestion} />
							))
						}
						</div>
					)}
				</div>
			</div>
		</section>
	)
}


RecurringExpenseSuggestionsOverview.propTypes = {
	suggestions: PropTypes.arrayOf(
		PropTypes.shape({
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
		})
	).isRequired
}
