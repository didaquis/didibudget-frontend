import { Fragment, useContext } from 'react'
import { AuthContext } from '../AuthContext'

import { Jumbotron } from '../components/Jumbotron'
import { UserCard } from '../components/UserCard'

const Home = () => {
	const { userData } = useContext(AuthContext)
	const titleText = 'Welcome to didibudget!'
	const subtitleText = 'This website helps you manage your money.'
	const subtitleExtraLineText = 'Track your savings and spending, and explore charts that show where your money goes.'

	return (
		<Fragment>
			<Jumbotron title={titleText} subtitle={subtitleText} subtitleExtraLine={subtitleExtraLineText} />
			{
				Object.keys(userData).length > 0 && <UserCard userData={userData} />
			}
		</Fragment>
	)
}

Home.displayName = 'Home'

export default Home
