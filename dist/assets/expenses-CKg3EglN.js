import{g as e}from"./index-ukl8PQQ5.js";const s=e`
fragment ExpenseFields on Expense {
	category
	subcategory
	quantity
	date
	currencyISO
	uuid
}
`,t=e`
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
`,a=e`
fragment ExpensesMonthlyAverageFields on ExpensesMonthlyAverage {
  average
  currencyISO
}
`,E=e`
query GetAllExpenses {
	getExpenses {
		...ExpenseFields
	}
}
${s}
`,g=e`
query GetAllExpensesAndCategories {
	getExpenses {
		...ExpenseFields
	}
	getExpenseCategory {
		...ExpenseCategoryFields
	}
}
${s}
${t}
`,r=e`
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
${s}
${t}
`,o=e`
query GetExpensesBetweenDatesAndCategories($startDate: String!, $endDate: String!) {
	getExpensesBetweenDates(startDate: $startDate, endDate: $endDate) {
		...ExpenseFields
	}
	getExpenseCategory {
		...ExpenseCategoryFields
	}
}
${s}
${t}
`,y=e`
query GetExpensesSumByType($categoryType: CategoryType!) {
	getExpensesSumByType(categoryType: $categoryType) {
		categoryType
		currencyISO
		sum
	}
}
`,p=e`
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
`,d=e`
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
${a}
`;export{t as E,p as G,E as L,y as a,d as b,r as c,g as d,o as e};
