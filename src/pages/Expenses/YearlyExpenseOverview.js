import { Fragment } from 'react'

import { PageTitle } from '../../components/PageTitle'
import { GetYearlyExpenseOverview } from '../../components/Expenses/GetYearlyExpenseOverview'

const YearlyExpenseOverview = () => {
	const startDate = '2023-09-11T22:00:00.000Z' // TODO: Pending to pass valid parameters
	const endDate = '2023-11-30T21:59:59.999Z'

	return (
		<Fragment>
			<PageTitle text='Yearly expense overview' />
			<GetYearlyExpenseOverview startDate={startDate} endDate={endDate} />
		</Fragment>
	)
}

YearlyExpenseOverview.displayName = 'YearlyExpenseOverview'

export default YearlyExpenseOverview
