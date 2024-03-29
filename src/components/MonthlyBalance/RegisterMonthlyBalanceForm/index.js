import { useState, Fragment } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

import { ErrorAlert } from '../../ErrorAlert'
import { SubmitButton } from '../../SubmitButton'
import { SubmitButtonHelper } from '../../SubmitButtonHelper'

import { useInputValue } from '../../../hooks/useInputValue'
import { validateRegisterMonthlyBalanceForm } from '../../../utils/validations'
import { getLastFiveYearsFrom } from '../utils'

import { REGISTER_MONTHLY_BALANCE } from '../../../gql/mutations/monthlyBalances'

export const RegisterMonthlyBalanceForm = () => {
	const currentYear = new Date().getFullYear()
	const currentMonth = new Date().getMonth()
	const availableYears = getLastFiveYearsFrom(currentYear)
	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

	const navigate = useNavigate()
	const [isDisabled, setIsDisabled] = useState(false)
	const [error, setError] = useState(null)

	const [ registerMonthlyBalance ] = useMutation(REGISTER_MONTHLY_BALANCE)

	const balance = useInputValue('')
	const year = useInputValue(currentYear)
	const month = useInputValue(monthNames[currentMonth])


	const handleSubmit = (event) => {
		event.preventDefault()
		setIsDisabled(true)
		setError(null)

		const dateToRegister = new Date(year.value, monthNames.indexOf(month.value), 1, 3)

		const variables = { balance: parseFloat(balance.value), date: dateToRegister }

		registerMonthlyBalance({ variables }).then(() => {
			navigate('/view-monthly-balance')
		}).catch(e => {
			setError(e.message)
			setIsDisabled(false)
		})
	}

	return (
		<Fragment>
			<div className="row justify-content-center mt-4">
				<form className="col-md-8" disabled={isDisabled} onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="inputbalanceRegisterMonthlyBalanceForm" className="text-light">Balance <span className="text-danger">*</span></label>
						<input
							disabled={isDisabled}
							inputMode="decimal"
							className="form-control"
							id="inputbalanceRegisterMonthlyBalanceForm"
							placeholder='1234.99'
							type='number'
							step='0.01'
							{...balance}
							required
							autoFocus
						/>
						<small id="balanceHelp" className="form-text text-muted">
							Enter the balance on the 1st of each month before the first spend was made. Use decimal point as decimal separator
						</small>
					</div>

					<div className="form-row">
						<div className="col">

							<div className="form-group">
								<label htmlFor="selectYear" className="text-light">Year <span className="text-danger">*</span></label>
								<select className="form-control" id="selectYear" {...year}>
									{
										availableYears.map((year) => {
											return <option key={year}>{year}</option>
										})
									}
								</select>
							</div>

						</div>
						<div className="col">
							<div className="form-group">
								<label htmlFor="selectMonth" className="text-light">Month <span className="text-danger">*</span></label>
								<select className="form-control" id="selectMonth" {...month}>
									{
										monthNames.map((month) => {
											return <option key={month}>{month}</option>
										})
									}
								</select>
							</div>
						</div>
					</div>

					<div className="mt-2 ml-1">
						<SubmitButton disabled={isDisabled || !validateRegisterMonthlyBalanceForm(balance.value, year.value, month.value)}>Save monthly balance</SubmitButton>
						<SubmitButtonHelper mustShowHelper={!validateRegisterMonthlyBalanceForm(balance.value, year.value, month.value)}></SubmitButtonHelper>
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
