import{g as a}from"./index-ukl8PQQ5.js";const n=a`
query getMonthlyBalances {
	getMonthlyBalances {
		balance,
		date,
		currencyISO,
		uuid
	}
}
`,t=a`
query getMonthlyBalancesWithPagination ($page: Int!, $pageSize: Int!) {
	getMonthlyBalancesWithPagination (page: $page, pageSize: $pageSize) {
		monthlyBalances {
			balance,
			date,
			currencyISO,
			uuid 
		}
		pagination {
			currentPage
			totalPages
		}
	}
}
`;export{n as L,t as a};
