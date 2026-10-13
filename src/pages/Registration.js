import { Fragment, useContext } from 'react'
import { Link } from 'react-router'

import { AuthContext } from '../AuthContext'

import { PageTitle } from '../components/PageTitle'
import { RegisterForm } from '../components/RegisterForm'


export const Registration = () => {

	const { activateAuth } = useContext(AuthContext)

	return (
		<Fragment>
			<PageTitle text='Create an account' />
			<RegisterForm activateAuth={activateAuth} />
			<div className="row justify-content-center mt-4">
				<div className="col-md-8">
					<Link className="text-info fw-light small" to='/'>
						Log in
					</Link>
				</div>
			</div>
		</Fragment>
	)
}