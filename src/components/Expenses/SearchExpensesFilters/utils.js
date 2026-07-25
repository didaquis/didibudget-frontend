import { getNameOfCategoryOrSubcategory } from '../utils'

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

/**
 * Check if the value written by the user for an amount field is valid.
 * An empty or blank value is valid (an empty filter is valid). Otherwise, the value
 * must parse to a finite number greater than or equal to zero: the backend rejects
 * negative amounts.
 * @param {string} value
 * @returns {boolean}
 */
const isValidAmountInput = (value) => {
	if (!isFilled(value) || value.trim() === '') {
		return true
	}

	const parsed = Number(value.trim().replace(',', '.'))

	return Number.isFinite(parsed) && parsed >= 0
}

/**
 * Format a date as YYYY-MM-DD using local time, matching how the results table
 * renders dates.
 * @param {Date} date
 * @returns {string}
 */
const formatDateAsLocalISO = (date) => {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')

	return `${year}-${month}-${day}`
}

/**
 * Build a human readable summary of the active filters, meant to be shown as the
 * label of the collapsed filters header.
 * @param {Object} filters
 * @param {Array} categories
 * @returns {string}
 */
const buildFiltersSummary = (filters, categories) => {
	const parts = []

	if (isFilled(filters.subcategory)) {
		const categoryName = getNameOfCategoryOrSubcategory(filters.category, categories)
		const subcategoryName = getNameOfCategoryOrSubcategory(filters.subcategory, categories)
		parts.push(`${categoryName} - ${subcategoryName}`)
	} else if (isFilled(filters.category)) {
		parts.push(getNameOfCategoryOrSubcategory(filters.category, categories))
	} else {
		parts.push('All categories')
	}

	if (isFilled(filters.startDate) && isFilled(filters.endDate)) {
		parts.push(`${formatDateAsLocalISO(filters.startDate)} to ${formatDateAsLocalISO(filters.endDate)}`)
	} else if (isFilled(filters.startDate)) {
		parts.push(`from ${formatDateAsLocalISO(filters.startDate)}`)
	} else if (isFilled(filters.endDate)) {
		parts.push(`until ${formatDateAsLocalISO(filters.endDate)}`)
	}

	if (isFilled(filters.minQuantity) && isFilled(filters.maxQuantity)) {
		parts.push(`${filters.minQuantity} to ${filters.maxQuantity}`)
	} else if (isFilled(filters.minQuantity)) {
		parts.push(`from ${filters.minQuantity}`)
	} else if (isFilled(filters.maxQuantity)) {
		parts.push(`up to ${filters.maxQuantity}`)
	}

	return parts.join(' · ')
}

export {
	parseAmount,
	startOfDay,
	endOfDay,
	buildSearchVariables,
	isValidAmountInput,
	buildFiltersSummary
}
