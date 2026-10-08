import { useEffect, useRef, useState, Fragment } from 'react'
import { useMutation } from '@apollo/client'

import { ErrorAlert } from '../../ErrorAlert'
import { SuccessToast } from '../../SuccessToast'
import { SubmitButton } from '../../SubmitButton'
import { SubmitButtonHelper } from '../../SubmitButtonHelper'

import { useInputValue } from '../../../hooks/useInputValue'
import { validateRegisterMonthlyBalanceForm } from '../../../utils/validations'
import { MONTHS, formatMonth } from '../../../utils/months'
import { getLastFiveYearsFrom } from '../utils'

import { REGISTER_MONTHLY_BALANCE } from '../../../gql/mutations/monthlyBalances'
import { formatAmount } from '../../../utils/currency'

export const RegisterMonthlyBalanceForm = () => {
	const currentYear = new Date().getFullYear()
	const currentMonth = new Date().getMonth()
	const availableYears = getLastFiveYearsFrom(currentYear)

	const [isDisabled, setIsDisabled] = useState(false)
	const [error, setError] = useState(null)
	const [notice, setNotice] = useState(null)
	const noticeIdRef = useRef(0)
	const balanceInputRef = useRef(null)

	const [registerMonthlyBalance] = useMutation(REGISTER_MONTHLY_BALANCE)

	/* Plain state instead of useInputValue: this is the only field that gets cleared on save */
	const [balance, setBalance] = useState('')
	const year = useInputValue(currentYear)
	const month = useInputValue(MONTHS[currentMonth].value)

	const isValid = validateRegisterMonthlyBalanceForm(balance, year.value, month.value)

	useEffect(() => {
		if (notice) {
			balanceInputRef.current?.focus()
		}
	}, [notice])

	const handleSubmit = (event) => {
		event.preventDefault()
		if (!isValid) {
			return
		}
		setIsDisabled(true)
		setError(null)
		setNotice(null)

		const savedYear = parseInt(year.value, 10)
		const savedMonth = month.value
		const savedBalance = parseFloat(balance)

		const variables = { balance: savedBalance, year: savedYear, month: savedMonth }

		registerMonthlyBalance({ variables }).then(() => {
			noticeIdRef.current += 1
			setNotice({ id: noticeIdRef.current, message: `${formatAmount(savedBalance.toFixed(2))} · ${formatMonth({ year: savedYear, month: savedMonth })}` })
			setBalance('')
			setIsDisabled(false)
		}).catch(e => {
			setError(e.message)
			setIsDisabled(false)
		})
	}

	return (
		<Fragment>
			<div className="row justify-content-center">
				<form className="col-md-8" disabled={isDisabled} onSubmit={handleSubmit}>

					<SuccessToast notice={notice} />

					<div className="col mb-3">
						<label htmlFor="inputbalanceRegisterMonthlyBalanceForm" className="text-light">Balance <span className="text-danger">*</span></label>
						<input
							ref={balanceInputRef}
							disabled={isDisabled}
							inputMode="decimal"
							className="form-control"
							id="inputbalanceRegisterMonthlyBalanceForm"
							placeholder='1234.99'
							type='number'
							step='0.01'
							value={balance}
							onChange={(event) => setBalance(event.target.value)}
							required
							autoFocus
						/>
						<small id="balanceHelp" className="form-text text-white-50 d-block">
							Enter the balance on the 1st of each month before the first spend was made. Use decimal point as decimal separator
						</small>
					</div>

					<div className="row mb-4">
						<div className="col">
							<label htmlFor="selectYear" className="text-light">Year <span className="text-danger">*</span></label>
							<select className="form-control" id="selectYear" {...year}>
								{
									availableYears.map((year) => {
										return <option key={year}>{year}</option>
									})
								}
							</select>
						</div>
						<div className="col">
							<label htmlFor="selectMonth" className="text-light">Month <span className="text-danger">*</span></label>
							<select className="form-control" id="selectMonth" {...month}>
								{
									MONTHS.map(({ value, label }) => {
										return <option key={value} value={value}>{label}</option>
									})
								}
							</select>
						</div>
					</div>

					<div className="mt-2">
						<SubmitButton disabled={isDisabled || !isValid}>Save monthly balance</SubmitButton>
						<SubmitButtonHelper mustShowHelper={!isValid}></SubmitButtonHelper>
					</div>
				</form>
				<div className="col-md-8">
					{
						error && <ErrorAlert errorMessage={error} />
					}
				</div>
			</div>
		</Fragment>
	)
}
