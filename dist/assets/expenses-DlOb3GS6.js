import{g as t}from"./index-ukl8PQQ5.js";const a=t`
mutation registerExpense($category: ID!,$subcategory: ID, $quantity: Float!, $date: String!) {
	registerExpense(category: $category, subcategory: $subcategory, quantity: $quantity, date: $date) {
		quantity
		date
		currencyISO
		uuid
	}
}
`,u=t`
mutation deleteExpense($uuid: String!) {
	deleteExpense(uuid: $uuid) {
	category
	subcategory
		quantity
		date
		currencyISO
		uuid
	}
}
`;export{u as D,a as R};
