import { Fragment } from 'react'

import { PageTitle } from '../../components/PageTitle'
import { GetYearlyExpenseOverview } from '../../components/Expenses/GetYearlyExpenseOverview'


const getFirstDayOfCurrentMonth = () => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
}


const YearlyExpenseOverview = () => {
    const startDate = getFirstDayOfCurrentMonth()
    const endDate = new Date()

    return (
        <Fragment>
            <PageTitle text='Monthly expense overview' />
            <GetYearlyExpenseOverview startDate={startDate} endDate={endDate} />
        </Fragment>
    )
}

YearlyExpenseOverview.displayName = 'YearlyExpenseOverview'

export default YearlyExpenseOverview
