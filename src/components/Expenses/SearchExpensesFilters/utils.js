import { getNameOfCategoryOrSubcategory } from '../utils'
import { startOfDay, endOfDay } from '../../../utils/utils'
import { formatAmount } from '../../../utils/currency'

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

const AMOUNT_FORMAT_ERROR = 'Amount must be a number using a decimal point or comma.'
const AMOUNT_RANGE_ERROR = 'Min amount can\'t be more than max amount.'

/**
 * Get the problem with the amounts written by the user, if any.
 * @param {string} minQuantity
 * @param {string} maxQuantity
 * @returns {{ message: string, isMinInvalid: boolean, isMaxInvalid: boolean }|null} null when both amounts are valid
 */
const getAmountError = (minQuantity, maxQuantity) => {
	const isMinInvalid = !isValidAmountInput(minQuantity)
	const isMaxInvalid = !isValidAmountInput(maxQuantity)

	if (isMinInvalid || isMaxInvalid) {
		return { message: AMOUNT_FORMAT_ERROR, isMinInvalid, isMaxInvalid }
	}

	const min = parseAmount(minQuantity)
	const max = parseAmount(maxQuantity)

	if (min !== undefined && max !== undefined && min > max) {
		return { message: AMOUNT_RANGE_ERROR, isMinInvalid: true, isMaxInvalid: true }
	}

	return null
}

const getTime = (date) => (isFilled(date) ? date.getTime() : null)

/**
 * Check if two sets of filters would run the same search.
 * @param {Object} filters
 * @param {Object} otherFilters
 * @returns {boolean}
 */
const areSameFilters = (filters, otherFilters) => {
	return Object.keys(filters).every(field => {
		if (field === 'startDate' || field === 'endDate') {
			return getTime(filters[field]) === getTime(otherFilters[field])
		}

		return filters[field] === otherFilters[field]
	})
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
 * Build one human readable part per active filter (category, dates, amounts), meant to be
 * shown in the collapsed filters header. Sorting is not a filter, so it never has a part.
 * @param {Object} filters
 * @param {Array} categories
 * @returns {string[]}
 */
const getFiltersSummaryParts = (filters, categories) => {
	const parts = []

	if (isFilled(filters.subcategory)) {
		const categoryName = getNameOfCategoryOrSubcategory(filters.category, categories)
		const subcategoryName = getNameOfCategoryOrSubcategory(filters.subcategory, categories)
		parts.push(`${categoryName} › ${subcategoryName}`)
	} else if (isFilled(filters.category)) {
		parts.push(getNameOfCategoryOrSubcategory(filters.category, categories))
	}

	if (isFilled(filters.startDate) && isFilled(filters.endDate)) {
		parts.push(`${formatDateAsLocalISO(filters.startDate)} to ${formatDateAsLocalISO(filters.endDate)}`)
	} else if (isFilled(filters.startDate)) {
		parts.push(`from ${formatDateAsLocalISO(filters.startDate)}`)
	} else if (isFilled(filters.endDate)) {
		parts.push(`until ${formatDateAsLocalISO(filters.endDate)}`)
	}

	if (isFilled(filters.minQuantity) && isFilled(filters.maxQuantity)) {
		parts.push(`${formatAmount(filters.minQuantity)} to ${formatAmount(filters.maxQuantity)}`)
	} else if (isFilled(filters.minQuantity)) {
		parts.push(`from ${formatAmount(filters.minQuantity)}`)
	} else if (isFilled(filters.maxQuantity)) {
		parts.push(`up to ${formatAmount(filters.maxQuantity)}`)
	}

	return parts
}

export {
	parseAmount,
	buildSearchVariables,
	isValidAmountInput,
	getAmountError,
	areSameFilters,
	getFiltersSummaryParts
}
