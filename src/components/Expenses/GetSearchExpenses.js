import { Fragment, useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'

import { Spinner } from '../Spinner'
import { ErrorAlert } from '../ErrorAlert'
import { SearchExpensesFilters } from './SearchExpensesFilters'
import { SearchExpensesResults } from './SearchExpensesResults'
import { buildSearchVariables } from './SearchExpensesFilters/utils'

import { LIST_EXPENSE_CATEGORIES } from '../../gql/queries/expenseCategories'
import { SEARCH_EXPENSES } from '../../gql/queries/expenses'

const PAGE_SIZE = 25
const FIRST_PAGE = 1

export const GetSearchExpenses = () => {
	const [filters, setFilters] = useState(null)

	const categoriesQuery = useQuery(LIST_EXPENSE_CATEGORIES, { fetchPolicy: 'no-cache' })
	const [searchExpenses, searchQuery] = useLazyQuery(SEARCH_EXPENSES, { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true })

	const onSearch = (selectedFilters) => {
		setFilters(selectedFilters)
		searchExpenses({ variables: buildSearchVariables(selectedFilters, FIRST_PAGE, PAGE_SIZE) })
	}

	const onChangePage = (selectedPage) => {
		searchExpenses({ variables: buildSearchVariables(filters, selectedPage, PAGE_SIZE) })
	}

	if (categoriesQuery.loading) { return <Spinner /> }
	if (categoriesQuery.error) { return <ErrorAlert errorMessage={categoriesQuery.error.message} /> }

	const hasResults = !searchQuery.loading && !searchQuery.error && Boolean(searchQuery.data)

	return (
		<Fragment>
			<SearchExpensesFilters categories={categoriesQuery.data.getExpenseCategory} onSearch={onSearch} />

			{searchQuery.loading && <Spinner />}
			{searchQuery.error && <ErrorAlert errorMessage={searchQuery.error.message} />}
			{hasResults && (
				<SearchExpensesResults
					searchResult={searchQuery.data.searchExpenses}
					categories={categoriesQuery.data.getExpenseCategory}
					onChangePage={onChangePage}
				/>
			)}
		</Fragment>
	)
}
