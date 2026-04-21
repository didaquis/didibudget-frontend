import{g as e}from"./index-ukl8PQQ5.js";import{E}from"./expenses-CKg3EglN.js";const s=e`
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
`,r=e`
query GetExpenseCategoryById($category: ID!) {
	getExpenseCategoryById(category: $category) {
		...ExpenseCategoryFields
	}
}
${E}
`;export{r as G,s as L};
