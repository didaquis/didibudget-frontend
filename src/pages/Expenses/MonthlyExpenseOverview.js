import { Fragment } from 'react'

import { PageTitle } from '../../components/PageTitle'
import { GetYearlyExpenseOverview } from '../../components/Expenses/GetYearlyExpenseOverview'
import { getMonthToDateRange } from '../../utils/utils'


const MonthlyExpenseOverview = () => {
    const { startDate, endDate } = getMonthToDateRange(new Date())

    return (
        <Fragment>
            <PageTitle text='This month' />
            <GetYearlyExpenseOverview startDate={startDate} endDate={endDate} />
        </Fragment>
    )
}

MonthlyExpenseOverview.displayName = 'MonthlyExpenseOverview'

export default MonthlyExpenseOverview
