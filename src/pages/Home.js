import { Fragment, useContext } from 'react'
import { AuthContext } from '../AuthContext'

import { HomeHero } from '../components/HomeHero'
import Dashboard from './Dashboard/Dashboard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const Home = () => {
	const { isAuth } = useContext(AuthContext)
	useDocumentTitle(isAuth ? null : '')

	return (
		<Fragment>
			{
				!isAuth && <HomeHero />
			}
			{
				isAuth && <Dashboard />
			}
		</Fragment>
	)
}

Home.displayName = 'Home'

export default Home
