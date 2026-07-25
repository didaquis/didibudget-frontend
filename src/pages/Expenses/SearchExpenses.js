import { Fragment } from 'react'

import { PageTitle } from '../../components/PageTitle'
import { GetSearchExpenses } from '../../components/Expenses/GetSearchExpenses'

const SearchExpenses = () => {
	return (
		<Fragment>
			<PageTitle text='Spending search' />
			<GetSearchExpenses />
		</Fragment>
	)
}

SearchExpenses.displayName = 'SearchExpenses'

export default SearchExpenses
