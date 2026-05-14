import { Fragment, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../AuthContext'

import { PageTitle } from '../components/PageTitle'
import { LoginForm } from '../components/LoginForm'

export const Login = () => {

	const { activateAuth } = useContext(AuthContext)

	return (
		<Fragment>
			<PageTitle text='Log in' />
			<LoginForm activateAuth={activateAuth} />
			<div>
				<Link className="text-info fw-light me-2 small" to='/register'>
					Don't have an account?
				</Link>
				<span role="img" aria-label="Winking Face" aria-hidden="true">😉</span>
			</div>
		</Fragment>
	)
}