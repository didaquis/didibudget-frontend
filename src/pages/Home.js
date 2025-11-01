import { Fragment, useContext } from 'react'
import { AuthContext } from '../AuthContext'

import { Jumbotron } from '../components/Jumbotron'
import Dashboard from './Dashboard/Dashboard'

const Home = () => {
	const { isAuth } = useContext(AuthContext)
	const titleText = 'Welcome to didibudget!'
	const subtitleText = 'This website helps you manage your money.'
	const subtitleExtraLineText = 'Get an overview of your savings and spending and view charts that show where your money goes.'

	return (
		<Fragment>
			{
				!isAuth && <Jumbotron title={titleText} subtitle={subtitleText} subtitleExtraLine={subtitleExtraLineText} />
			}
			{
				isAuth && <Dashboard />
			}
		</Fragment>
	)
}

Home.displayName = 'Home'

export default Home
