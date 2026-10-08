import { useState, Fragment } from 'react'
import { useMutation } from '@apollo/client'
import PropTypes from 'prop-types'

import { ErrorAlert } from '../ErrorAlert'
import { SubmitButton } from '../SubmitButton'
import { SubmitButtonHelper } from '../SubmitButtonHelper'

import { useInputValue } from '../../hooks/useInputValue'
import { validateLoginForm } from '../../utils/validations'

import { LOGIN } from '../../gql/mutations/auth'

export const LoginForm = ({ activateAuth }) => {

	const [isDisabled, setIsDisabled] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)

	const [authUser] = useMutation(LOGIN)

	const email = useInputValue('')
	const password = useInputValue('')

	const handleSubmit = (event) => {
		event.preventDefault()
		setIsDisabled(true)
		setIsLoading(true)
		setError(null)

		const variables = { email: email.value, password: password.value }

		authUser({ variables }).then(({ data }) => {
			const { token } = data.authUser
			activateAuth(token)
		}).catch(e => {
			setError(e.message)
			setIsDisabled(false)
			setIsLoading(false)
		})
	}

	return (
		<Fragment>
			<div className="row justify-content-center">
				<form className="col-md-8" onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="inputEmailLoginForm" className="form-label text-light">Email <span className="text-danger">*</span></label>
						<input disabled={isDisabled} type='email' name="email" autoComplete="username" className="form-control" id="inputEmailLoginForm" {...email} required autoFocus />
					</div>
					<div className="mb-4">
						<label htmlFor="inputPasswordLoginForm" className="form-label text-light">Password <span className="text-danger">*</span></label>
						<input disabled={isDisabled} type='password' name="password" autoComplete="current-password" className="form-control" id="inputPasswordLoginForm" {...password} required />
					</div>
					<div className="my-4">
						<SubmitButton disabled={isDisabled || !validateLoginForm(email.value, password.value)}>
							{
								(!isLoading)
									?
									'Log in'
									:
									<Fragment>
										<span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
										<span>Loading</span>
									</Fragment>
							}
						</SubmitButton>
						<SubmitButtonHelper mustShowHelper={!validateLoginForm(email.value, password.value)}></SubmitButtonHelper>
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

LoginForm.propTypes = {
	activateAuth: PropTypes.func.isRequired,
}
