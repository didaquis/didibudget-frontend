import gql from 'graphql-tag'
import { EXPENSE_CATEGORY_FIELDS } from './expenses'

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

export const GET_EXPENSE_CATEGORY_BY_ID = gql`
query GetExpenseCategoryById($category: ID!) {
	getExpenseCategoryById(category: $category) {
		...ExpenseCategoryFields
	}
}
${EXPENSE_CATEGORY_FIELDS}
`