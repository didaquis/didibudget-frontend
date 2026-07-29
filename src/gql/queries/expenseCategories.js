import gql from 'graphql-tag'

export const LIST_EXPENSE_CATEGORIES = gql`
query GetExpenseCategories {
	getExpenseCategory {
		_id
		name
		subcategories {
			_id
			name
			uuid
			emojis
		}
		emojis
		uuid
	}
}
`

export const GET_MOST_USED_EXPENSE_CATEGORIES = gql`
query GetMostUsedExpenseCategories($days: Int!, $limit: Int!) {
	getMostUsedExpenseCategories(days: $days, limit: $limit) {
		category
		categoryName
		categoryEmojis
		subcategory
		subcategoryName
		subcategoryEmojis
	}
}
`
