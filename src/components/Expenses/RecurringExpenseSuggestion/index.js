import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router'
import PropTypes from 'prop-types'

import { SubmitButton } from '../../SubmitButton'
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

	return (
		<li className="list-group-item bg-dark text-light border-info px-0 py-3">
			<div className="d-flex justify-content-between align-items-baseline gap-3 mb-3">
				<p className="mb-0">{suggestion.suggestedExpense.categoryName} {(suggestion.suggestedExpense.subcategoryName) ? ` - ${suggestion.suggestedExpense.subcategoryName}` : ''} <EmojiListFromCategoryOrSubcategory emojis={emojis} /></p>
				<p className="mb-0 fs-5 text-nowrap">{formatAmount(suggestion.suggestedExpense.quantity)}</p>
			</div>
			<SubmitButton disabled={isDisabled} onClick={onSubmit}>Save spending</SubmitButton>
			{
				error && <p className="alert alert-danger py-3 text-center mt-3 mb-0" role="alert">{error}</p>
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
