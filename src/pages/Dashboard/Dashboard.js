import { Fragment, useContext } from 'react'
import { Link } from 'react-router'
import { AuthContext } from '../../AuthContext'

import { PageTitle } from '../../components/PageTitle'
import { GetMonthToDateSpending } from '../../components/Expenses/GetMonthToDateSpending'
import { GetRecurringExpenseSuggestions } from '../../components/Expenses/GetRecurringExpenseSuggestions'
import { UserCard } from '../../components/UserCard'

const Dashboard = () => {
	const { userData } = useContext(AuthContext)
	return (
		<Fragment>
			<PageTitle text='Dashboard' />
			<GetMonthToDateSpending />
			<div className="d-grid d-md-block mt-3">
				<Link className="btn btn-lg btn-outline-info" to='/spending/add'>Add spending</Link>
			</div>
			<GetRecurringExpenseSuggestions />
			<UserCard userData={userData} />
		</Fragment>
	)
}

Dashboard.displayName = 'Dashboard'

export default Dashboard
