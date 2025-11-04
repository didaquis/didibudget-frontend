import { Fragment, useContext } from 'react'
import { AuthContext } from '../../AuthContext'

import { PageTitle } from '../../components/PageTitle'
import { GetRecurringExpenseSuggestions } from '../../components/Expenses/GetRecurringExpenseSuggestions'
import { UserCard } from '../../components/UserCard'

const Dashboard = () => {
	const { userData } = useContext(AuthContext)
	return (
		<Fragment>
			<PageTitle text='Dashboard' />
			<GetRecurringExpenseSuggestions />
			<UserCard userData={userData} />
		</Fragment>
	)
}

Dashboard.displayName = 'Dashboard'

export default Dashboard
