import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router'
import PropTypes from 'prop-types'

import { EmojiListFromCategoryOrSubcategory } from '../../EmojiListFromCategoryOrSubcategory'

import { REGISTER_EXPENSE } from '../../../gql/mutations/expenses'
import { formatAmount } from '../../../utils/currency'

export const RecurringExpenseSuggestion = ({ suggestion }) => {
	const navigate = useNavigate()
	const [isDisabled, setIsDisabled] = useState(false)
	const [error, setError] = useState(null)

	const [registerExpense] = useMutation(REGISTER_EXPENSE)

	const onSubmit = async (event) => {
		try {
			event.preventDefault()
			setIsDisabled(true)

			const variables = {
				category: suggestion.suggestedExpense.category,
				subcategory: suggestion.suggestedExpense.subcategory,
				quantity: suggestion.suggestedExpense.quantity,
				date: new Date()
			}

			await registerExpense({ variables })

			navigate('/spending/list')
		} catch (error) {
			setError(error.message)
		} finally {
			setIsDisabled(false)
		}
	}

	const emojis = [...new Set([...suggestion.suggestedExpense.categoryEmojis, ...suggestion.suggestedExpense.subcategoryEmojis])]
	const { categoryName, subcategoryName, quantity } = suggestion.suggestedExpense
	const name = subcategoryName ? `${categoryName} - ${subcategoryName}` : categoryName
	const amount = formatAmount(quantity)

	return (
		<li className="list-group-item bg-dark text-light border-secondary px-0 py-3">
			<div className="d-flex align-items-center gap-3">
				<div className="flex-grow-1">
					<p className="mb-0">{name} <EmojiListFromCategoryOrSubcategory emojis={emojis} /></p>
					<p className="mb-0 fs-5 text-nowrap">{amount}</p>
				</div>
				<button className="btn btn-lg btn-outline-info" disabled={isDisabled} onClick={onSubmit} aria-label={`Save ${name}, ${amount}`}>Save</button>
			</div>
			{
				error && <p className="alert alert-danger py-3 text-center mt-2 mb-0" role="alert">{error}</p>
			}
		</li>
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
