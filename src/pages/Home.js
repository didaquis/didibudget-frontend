import { Fragment, useContext } from 'react'
import { Link } from 'react-router'
import { AuthContext } from '../AuthContext'

import { HomeHero } from '../components/HomeHero'
import { LoginForm } from '../components/LoginForm'
import Dashboard from './Dashboard/Dashboard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const Home = () => {
	const { isAuth, activateAuth } = useContext(AuthContext)
	useDocumentTitle(isAuth ? null : '')

	if (isAuth) {
		return <Dashboard />
	}

	return (
		<Fragment>
			<HomeHero />
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

Home.displayName = 'Home'

export default Home
