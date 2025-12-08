import gql from 'graphql-tag'

const EXPENSE_FIELDS = gql`
fragment ExpenseFields on Expense {
	category
	subcategory
	quantity
	date
	currencyISO
	uuid
}
`

export const EXPENSE_CATEGORY_FIELDS = gql`
fragment ExpenseCategoryFields on ExpenseCategory {
	_id
	name
	subcategories {
		_id
		name
		uuid
	}
	uuid
}
`
const EXPENSES_MONTHLY_AVERAGE_FIELDS = gql`
fragment ExpensesMonthlyAverageFields on ExpensesMonthlyAverage {
  average
  currencyISO
}
`

export const LIST_ALL_EXPENSES = gql`
query GetAllExpenses {
	getExpenses {
		...ExpenseFields
	}
}
${EXPENSE_FIELDS}
`

export const LIST_ALL_EXPENSES_AND_CATEGORIES = gql`
query GetAllExpensesAndCategories {
	getExpenses {
		...ExpenseFields
	}
	getExpenseCategory {
		...ExpenseCategoryFields
	}
}
${EXPENSE_FIELDS}
${EXPENSE_CATEGORY_FIELDS}
`

export const LIST_ALL_EXPENSES_WITH_PAGINATION_AND_CATEGORIES = gql`
query GetExpensesWithPaginationAndCategories($page: Int!, $pageSize: Int!) {
	getExpensesWithPagination(page: $page, pageSize: $pageSize) {
		expenses {
			...ExpenseFields
		}
		pagination {
			currentPage
			totalPages
		}
	}
	getExpenseCategory {
		...ExpenseCategoryFields
	}
}
${EXPENSE_FIELDS}
${EXPENSE_CATEGORY_FIELDS}
`

export const LIST_EXPENSES_BETWEEN_DATES_AND_CATEGORIES = gql`
query GetExpensesBetweenDatesAndCategories($startDate: String!, $endDate: String!) {
	getExpensesBetweenDates(startDate: $startDate, endDate: $endDate) {
		...ExpenseFields
	}
	getExpenseCategory {
		...ExpenseCategoryFields
	}
}
${EXPENSE_FIELDS}
${EXPENSE_CATEGORY_FIELDS}
`

export const GET_EXPENSES_SUM_BY_TYPE = gql`
query GetExpensesSumByType($categoryType: CategoryType!) {
	getExpensesSumByType(categoryType: $categoryType) {
		categoryType
		currencyISO
		sum
	}
}
`

export const GET_ALL_RECURRING_EXPENSE_SUGGESTIONS = gql`
query GetAllRecurringExpenseSuggestionsAndCategories ($day: Int!) {
	getRecurringExpenseSuggestionsByDay (day: $day) {
		uuid
		suggestedExpense {
			category
			categoryName
			categoryEmojis
			subcategory
			subcategoryName
			subcategoryEmojis
			quantity
		}
	}
}
`

export const GET_EXPENSES_AVERAGES = gql`
query GetExpensesMonthlyAverage($excludedCategoryTypes: [CategoryType!]) {
	lastThreeMonthsAverage: getExpensesMonthlyAverage(
		lastNMonths: 3
		excludedCategoryTypes: $excludedCategoryTypes
	) {
		...ExpensesMonthlyAverageFields
	}
	lastSixMonthsAverage: getExpensesMonthlyAverage(
		lastNMonths: 6
		excludedCategoryTypes: $excludedCategoryTypes
	) {
		...ExpensesMonthlyAverageFields
	}
	lastTwelveMonthsAverage: getExpensesMonthlyAverage(
		lastNMonths: 12
		excludedCategoryTypes: $excludedCategoryTypes
	) {
		...ExpensesMonthlyAverageFields
	}
	lastTwentyFourMonthsAverage: getExpensesMonthlyAverage(
		lastNMonths: 24
		excludedCategoryTypes: $excludedCategoryTypes
	) {
		...ExpensesMonthlyAverageFields
	}
}
${EXPENSES_MONTHLY_AVERAGE_FIELDS}
`
