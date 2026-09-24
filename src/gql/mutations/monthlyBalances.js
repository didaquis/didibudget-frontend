import gql from 'graphql-tag'


export const REGISTER_MONTHLY_BALANCE = gql`
mutation registerMonthlyBalance($balance: Float!, $year: Int!, $month: Month!) {
	registerMonthlyBalance(balance: $balance, year: $year, month: $month) {
		balance
		year
		month
		currencyISO
		uuid
	}
}
`

export const DELETE_MONTHLY_BALANCE = gql`
mutation deleteMonthlyBalance($uuid: String!) {
	deleteMonthlyBalance(uuid: $uuid) {
		balance
		year
		month
		currencyISO
		uuid
	}
}
`
