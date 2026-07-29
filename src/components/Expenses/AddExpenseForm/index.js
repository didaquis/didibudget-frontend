import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/client'

import { ErrorAlert } from '../../ErrorAlert'
import { SubmitButton } from '../../SubmitButton'
import { SubmitButtonHelper } from '../../SubmitButtonHelper'
import { DateQuickSelector } from '../../DateQuickSelector'
import { CategoryPicker } from '../CategoryPicker'

import { validateAddExpenseForm } from '../../../utils/validations'

import { REGISTER_EXPENSE } from '../../../gql/mutations/expenses'

const startOfToday = () => {
	const date = new Date()
	date.setHours(0, 0, 0, 0)
	return date
}

export const AddExpenseForm = ({ categories, frequentCategories }) => {
	const [isDisabled, setIsDisabled] = useState(false)
	const [error, setError] = useState(null)
	const [savedMessage, setSavedMessage] = useState(null)
	const [amount, setAmount] = useState('')
	const [date, setDate] = useState(startOfToday)
	const [selected, setSelected] = useState(null)
	const amountInputRef = useRef(null)

	const [registerExpense] = useMutation(REGISTER_EXPENSE)

	const isValid = validateAddExpenseForm(amount, date, selected)

	useEffect(() => {
		if (savedMessage) {
			amountInputRef.current?.focus()
		}
	}, [savedMessage])

	const handleSubmit = (event) => {
		event.preventDefault()
		if (!isValid) {
			return
		}
		setIsDisabled(true)
		setError(null)
		setSavedMessage(null)

		const quantity = parseFloat(amount)
		const label = selected.label

		const variables = {
			category: selected.categoryID,
			subcategory: selected.subcategoryID,
			quantity: quantity,
			date: date
		}

		registerExpense({ variables }).then(() => {
			setSavedMessage(`Saved: ${quantity} EUR · ${label}`)
			setAmount('')
			setDate(startOfToday())
			setSelected(null)
			setIsDisabled(false)
		}).catch(e => {
			setError(e.message)
			setIsDisabled(false)
		})
	}

	return (
		<div className="container my-4 mx-0">
			<div className="row justify-content-center">
				<form className="col-md-8" onSubmit={handleSubmit}>

					{
						// Feedback sits above every field on purpose: saving reopens the category picker,
						// so anything below it gets pushed off a 390px screen.
					}
					{
						savedMessage && <p className="alert alert-success py-3 text-center mb-4" role="status">{savedMessage}</p>
					}
					{
						error && <ErrorAlert errorMessage={error} />
					}

					<div className="mb-4">
						<label htmlFor="inputAmountAddExpenseForm" className="text-light">Amount <span className="text-danger">*</span></label>
						<input
							ref={amountInputRef}
							disabled={isDisabled}
							inputMode="decimal"
							className="form-control"
							id="inputAmountAddExpenseForm"
							placeholder="1234.99"
							type="number"
							step="0.01"
							value={amount}
							onChange={(event) => setAmount(event.target.value)}
							required
							autoFocus
						/>
						<small className="form-text text-muted d-block">Use decimal point as decimal separator. Negative numbers are not valid</small>
					</div>

					<div className="mb-4">
						<p className="text-light mb-1">Date <span className="text-danger">*</span></p>
						<DateQuickSelector value={date} onChange={setDate} />
					</div>

					<div className="mb-4">
						<p className="text-light mb-1">Category <span className="text-danger">*</span></p>
						<CategoryPicker
							categories={categories}
							frequentCategories={frequentCategories}
							selected={selected}
							onSelect={setSelected}
						/>
					</div>

					<div>
						<SubmitButton disabled={isDisabled || !isValid}>Save expense</SubmitButton>
						<SubmitButtonHelper mustShowHelper={!isValid} />
					</div>
				</form>
			</div>
		</div>
	)
}

AddExpenseForm.propTypes = {
	categories: PropTypes.array.isRequired,
	frequentCategories: PropTypes.array.isRequired
}
