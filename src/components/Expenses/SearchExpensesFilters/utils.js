/**
 * Check if a filter value has been filled in by the user.
 * An empty string must never reach the API: the backend treats it as a provided
 * value and its validation rejects it.
 * @param {*} value
 * @returns {boolean}
 */
const isFilled = (value) => value !== null && value !== undefined && value !== ''

/**
 * Parse an amount written by the user, accepting both decimal point and decimal comma
 * @example
 * 	parseAmount('23,15') // 23.15
 * @param {string} value
 * @returns {number|undefined} undefined when the value is empty or not a number
 */
const parseAmount = (value) => {
	if (!isFilled(value) || value.trim() === '') {
		return undefined
	}

	const parsed = Number(value.trim().replace(',', '.'))

	return Number.isFinite(parsed) ? parsed : undefined
}

/**
 * Get a copy of a date placed at the very beginning of its day
 * @param {Date} date
 * @returns {Date}
 */
const startOfDay = (date) => {
	const result = new Date(date)
	result.setHours(0, 0, 0, 0)
	return result
}

/**
 * Get a copy of a date placed at the very end of its day
 * @param {Date} date
 * @returns {Date}
 */
const endOfDay = (date) => {
	const result = new Date(date)
	result.setHours(23, 59, 59, 999)
	return result
}

/**
 * Build the variables of the searchExpenses query.
 * Every filter left empty is omitted from the result: the backend accepts an absent
 * argument, but rejects an empty string.
 * @param {Object} filters
 * @param {number} page
 * @param {number} pageSize
 * @returns {Object}
 */
const buildSearchVariables = (filters, page, pageSize) => {
	const variables = {
		page,
		pageSize,
		sortBy: filters.sortBy,
		sortDirection: filters.sortDirection
	}

	if (isFilled(filters.category)) {
		variables.category = filters.category
	}

	if (isFilled(filters.subcategory)) {
		variables.subcategory = filters.subcategory
	}

	if (isFilled(filters.startDate)) {
		variables.startDate = startOfDay(filters.startDate).toISOString()
	}

	if (isFilled(filters.endDate)) {
		variables.endDate = endOfDay(filters.endDate).toISOString()
	}

	const minQuantity = parseAmount(filters.minQuantity)
	const maxQuantity = parseAmount(filters.maxQuantity)

	if (minQuantity !== undefined) {
		variables.minQuantity = minQuantity
	}

	if (maxQuantity !== undefined) {
		variables.maxQuantity = maxQuantity
	}

	return variables
}

export {
	parseAmount,
	startOfDay,
	endOfDay,
	buildSearchVariables
}
