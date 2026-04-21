import{g as a}from"./index-ukl8PQQ5.js";const t=a`
mutation registerMonthlyBalance($balance: Float!, $date: String!) {
	registerMonthlyBalance(balance: $balance, date: $date) {
		balance
		date
		currencyISO
		uuid
	}
}
`,n=a`
mutation deleteMonthlyBalance($uuid: String!) {
	deleteMonthlyBalance(uuid: $uuid) {
		balance
		date
		currencyISO
		uuid
	}
}
`;export{n as D,t as R};
