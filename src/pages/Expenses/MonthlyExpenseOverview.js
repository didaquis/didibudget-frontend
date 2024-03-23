import { Fragment } from 'react'

import { PageTitle } from '../../components/PageTitle'
import { GetYearlyExpenseOverview } from '../../components/Expenses/GetYearlyExpenseOverview'


const getFirstDayOfCurrentMonth = () => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
}


const MonthlyExpenseOverview = () => {
    const startDate = getFirstDayOfCurrentMonth()
    const endDate = new Date()

    return (
        <Fragment>
            <PageTitle text='Monthly expense overview' />
            <GetYearlyExpenseOverview startDate={startDate} endDate={endDate} />
        </Fragment>
    )
}

MonthlyExpenseOverview.displayName = 'MonthlyExpenseOverview'

export default MonthlyExpenseOverview
