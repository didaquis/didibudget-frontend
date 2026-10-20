import { Fragment, useState } from 'react'

import { PageTitle } from '../../components/PageTitle'
import { GetYearlyExpenseOverview } from '../../components/Expenses/GetYearlyExpenseOverview'
import { getLastTwelveFullMonthsRange } from '../../utils/utils'


const YearlyExpenseOverview = () => {
	// Read the clock once, so a render in another month does not ask for another range
	const [{ startDate, endDate }] = useState(() => getLastTwelveFullMonthsRange(new Date()))

	return (
		<Fragment>
			<PageTitle text='Last 12 months' />
			<GetYearlyExpenseOverview startDate={startDate} endDate={endDate} />
		</Fragment>
	)
}

YearlyExpenseOverview.displayName = 'YearlyExpenseOverview'

export default YearlyExpenseOverview
