import { Fragment } from 'react'

import { PageTitle } from '../../components/PageTitle'

import { GetListOfExpenseCategories } from '../../components/Expenses/GetListOfExpenseCategories'

const ExpenseCategorySelector = () => {
	return (
		<Fragment>
			<PageTitle text='Add spending' />
			<GetListOfExpenseCategories />
		</Fragment>
	)
}

ExpenseCategorySelector.displayName = 'ExpenseCategorySelector'

export default ExpenseCategorySelector
