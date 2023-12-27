import { Fragment } from 'react'

import { PageTitle } from '../../components/PageTitle'
import { GetYearlyExpenseOverview } from '../../components/Expenses/GetYearlyExpenseOverview'


const getFirstMillisecondOfTwelveMonthsBefore = () => {
	const now = new Date()
	const result = new Date(now.getFullYear(), now.getMonth(), 1)
	result.setHours(0, 0, 0, 0)
	result.setDate(1)
	result.setFullYear(result.getFullYear() - 1)

	return result
}

const getLastMillisecondOfPreviousMonth = () => {
	const now = new Date()
	const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
	const result = new Date(firstDayOfCurrentMonth.getTime() - 1)

	return result
}


const YearlyExpenseOverview = () => {
	const startDate = getFirstMillisecondOfTwelveMonthsBefore()
	const endDate = getLastMillisecondOfPreviousMonth()

	return (
		<Fragment>
			<PageTitle text='Yearly expense overview' />
			<GetYearlyExpenseOverview startDate={startDate} endDate={endDate} />
		</Fragment>
	)
}

YearlyExpenseOverview.displayName = 'YearlyExpenseOverview'

export default YearlyExpenseOverview
