const CategoryType = Object.freeze({
	EXPENSE: 'expense',
	INVESTMENT: 'investment',
	PENSION_PLAN: 'pension_plan'
})


const getCategoryTypeText = (categoryType) => {
	const texts = {
		[CategoryType.EXPENSE]: 'Spending',
		[CategoryType.INVESTMENT]: 'Portfolio investment',
		[CategoryType.PENSION_PLAN]: 'Pension plan'
	}

	return texts[categoryType] || categoryType
}

export { CategoryType, getCategoryTypeText }