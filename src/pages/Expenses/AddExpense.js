import { Fragment } from 'react'

import { PageTitle } from '../../components/PageTitle'
import { GetAddExpenseData } from '../../components/Expenses/GetAddExpenseData'

const AddExpense = () => {
	return (
		<Fragment>
			<PageTitle text='Add spending' />
			<GetAddExpenseData />
		</Fragment>
	)
}

AddExpense.displayName = 'AddExpense'

export default AddExpense
