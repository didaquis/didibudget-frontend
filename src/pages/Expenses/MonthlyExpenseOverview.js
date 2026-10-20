import { Fragment, useState } from 'react'

import { PageTitle } from '../../components/PageTitle'
import { GetYearlyExpenseOverview } from '../../components/Expenses/GetYearlyExpenseOverview'
import { getMonthToDateRange } from '../../utils/utils'


const MonthlyExpenseOverview = () => {
    // Read the clock once, so a render after midnight does not ask for another range
    const [{ startDate, endDate }] = useState(() => getMonthToDateRange(new Date()))

    return (
        <Fragment>
            <PageTitle text='This month' />
            <GetYearlyExpenseOverview startDate={startDate} endDate={endDate} />
        </Fragment>
    )
}

MonthlyExpenseOverview.displayName = 'MonthlyExpenseOverview'

export default MonthlyExpenseOverview
