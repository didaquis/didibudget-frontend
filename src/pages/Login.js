import { Fragment, useContext } from 'react'
import { Link } from 'react-router'
import { AuthContext } from '../AuthContext'

import { PageTitle } from '../components/PageTitle'
import { LoginForm } from '../components/LoginForm'

export const Login = () => {

	const { activateAuth } = useContext(AuthContext)

	return (
		<Fragment>
			<PageTitle text='Log in' />
			<LoginForm activateAuth={activateAuth} />
			<div className="row justify-content-center">
				<div className="col-md-8">
					<Link className="text-info fw-light small" to='/register'>
						Create an account
					</Link>
				</div>
			</div>
		</Fragment>
	)
}