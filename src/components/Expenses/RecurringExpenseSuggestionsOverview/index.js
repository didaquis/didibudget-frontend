import PropTypes from 'prop-types'

import { SectionTitle } from '../../SectionTitle'
import { RecurringExpenseSuggestion } from '../RecurringExpenseSuggestion'

export const RecurringExpenseSuggestionsOverview = ({ suggestions }) => {
	const hasSuggestions = !!suggestions.length

	return (
		<section>
			<SectionTitle text='Suggestions' level={2} />
			{!hasSuggestions ? (
				<p className="text-light" role="status">No suggestions available right now.</p>
			) : (
				<ul className="list-group list-group-flush">
					{
						suggestions.map(suggestion => (
							<RecurringExpenseSuggestion key={suggestion.uuid} suggestion={suggestion} />
						))
					}
				</ul>
			)}
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
