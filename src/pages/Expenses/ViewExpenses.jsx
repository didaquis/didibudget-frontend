import { Fragment } from 'react'

import { PageTitle } from '../../components/PageTitle'
import { GetDataExpenses } from '../../components/Expenses/GetDataExpenses'

const ViewExpenses = () => {
	return (
		<Fragment>
			<PageTitle text='Spending Overview' />
			<GetDataExpenses />
		</Fragment>
	)
}

ViewExpenses.displayName = 'ViewExpenses'

export default ViewExpenses
