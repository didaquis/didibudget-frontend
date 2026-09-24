import gql from 'graphql-tag'

export const LIST_ALL_MONTHLY_BALANCES = gql`
query getMonthlyBalances {
	getMonthlyBalances {
		balance,
		year,
		month,
		currencyISO,
		uuid
	}
}
`

export const LIST_ALL_MONTHLY_BALANCES_WITH_PAGINATION = gql`
query getMonthlyBalancesWithPagination ($page: Int!, $pageSize: Int!) {
	getMonthlyBalancesWithPagination (page: $page, pageSize: $pageSize) {
		monthlyBalances {
			balance,
			year,
			month,
			currencyISO,
			uuid
		}
		pagination {
			currentPage
			totalPages
		}
	}
}
`
