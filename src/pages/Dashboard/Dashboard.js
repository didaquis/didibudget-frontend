import { Fragment, useContext } from 'react'
import { AuthContext } from '../../AuthContext'

import { UserCard } from '../../components/UserCard'
import { PageTitle } from '../../components/PageTitle'

const Dashboard = () => {
	const { userData } = useContext(AuthContext)
	return (
		<Fragment>
			<PageTitle text='Dashboard' />
			<UserCard userData={userData} />
		</Fragment>
	)
}

Dashboard.displayName = 'Dashboard'

export default Dashboard
