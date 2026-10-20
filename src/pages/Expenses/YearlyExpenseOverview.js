import { Fragment } from 'react'

import { PageTitle } from '../../components/PageTitle'
import { GetYearlyExpenseOverview } from '../../components/Expenses/GetYearlyExpenseOverview'
import { getLastTwelveFullMonthsRange } from '../../utils/utils'


const YearlyExpenseOverview = () => {
	const { startDate, endDate } = getLastTwelveFullMonthsRange(new Date())

	return (
		<Fragment>
			<PageTitle text='Last 12 months' />
			<GetYearlyExpenseOverview startDate={startDate} endDate={endDate} />
		</Fragment>
	)
}

YearlyExpenseOverview.displayName = 'YearlyExpenseOverview'

export default YearlyExpenseOverview
