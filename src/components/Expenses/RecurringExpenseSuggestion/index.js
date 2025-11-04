import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import { SubmitButton } from '../../SubmitButton'
import { EmojiListFromCategoryOrSubcategory } from '../../EmojiListFromCategoryOrSubcategory'

import { REGISTER_EXPENSE } from '../../../gql/mutations/expenses'

export const RecurringExpenseSuggestion = ({ suggestion }) => {
	const navigate = useNavigate()
	const [isDisabled, setIsDisabled] = useState(false)

	const [ registerExpense ] = useMutation(REGISTER_EXPENSE)

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

			navigate('/expenses-administration')
		} catch (error) {
			console.error('Error registering expense:', error)
		} finally {
			setIsDisabled(false)
		}
	}

	const emojis = [...new Set([...suggestion.suggestedExpense.categoryEmojis, ...suggestion.suggestedExpense.subcategoryEmojis])]

	return (
		<div className="col-sm-6 col-md-4">
			<div className="card bg-dark border-info text-light mb-3">
				<div className="card-body">
					<h5 className="card-title">{suggestion.suggestedExpense.categoryName} {(suggestion.suggestedExpense.subcategoryName) ? ` - ${suggestion.suggestedExpense.subcategoryName}` : ''} <EmojiListFromCategoryOrSubcategory emojis={emojis} /></h5>
					<p className="card-text"><span className="text-nowrap">{suggestion.suggestedExpense.quantity} EUR</span></p>
					<SubmitButton disabled={isDisabled} onClick={onSubmit}>Save expense</SubmitButton>
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
