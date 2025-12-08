import { firstDayOfNextMonth, firstDayOfTheMonth, parseUnixTimestamp, trimDecimalPoints } from '../../../utils/utils'

/**
 * Get name of month and year from a date
 * @example
 * 	getLocaleDateString('2020-12-01'); // December 2020
 * @param {string} date - Example: '2020-12-01'
 * @returns {string}
 */
const getLocaleDateString = (date) => {
	return new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })
}

/**
 * Get an array with a date of the first day of the month for all months in "data" (included gaps)
 * @requires firstDayOfNextMonth
 * @requires firstDayOfTheMonth
 * @param {Array.<Object>} data - An array of objects
 * @param {string} data.date - A valid date with this format '2018-03-01'
 * @returns {Array.<string>}
 */
const getListOfAllMonths = (data = []) => {
	const ensureDateAscending = (a, b) => new Date(a.date) - new Date(b.date)
	data.sort(ensureDateAscending)

	const firstMonth = firstDayOfTheMonth(data[0].date)
	const lastMonth = firstDayOfTheMonth(data[data.length - 1].date)

	const listOfAllMonths = [firstMonth]
	while (listOfAllMonths[listOfAllMonths.length -1] !== lastMonth) {
		const nextMonth = firstDayOfNextMonth(listOfAllMonths[listOfAllMonths.length -1])
		listOfAllMonths.push(nextMonth)
	}
	return listOfAllMonths
}


/**
 * Parse the data of expenses to obtain the sum per month. This function refill the empty data of every month and do a sum of every months.
 * @requires getLocaleDateString
 * @requires trimDecimalPoints
 * @example
 * 	const data = [{quantity: 3, date: '2020-10-31'}, {quantity: 99.03, date: '2020-10-31'}, {quantity: 2.45, date: '2020-12-07'}]
 * 	getSumPerMonth(data) // [{ label: 'October 2020', sum: 102.03 }, { label: 'November 2020', sum: 0 }, { label: 'December 2020', sum: 2.45 }]
 * @param {Array.<Object>} data - An array of objects
 * @param {string} data.date - A valid date with this format '2018-03-01'
 * @param {float|integer} data.quantity
 * @returns {Array.<Object>}
*/
const getSumPerMonth = (data = []) => {
	if (!data.length) {
		return []
	}

	const listOfAllMonths = getListOfAllMonths(data)

	const emptyExpenses = listOfAllMonths.map( month => {
		return {
			label: getLocaleDateString(month),
			sum: 0
		}
	})

	const realExpenses = data.map(element => {
		return {
			label: getLocaleDateString(element.date),
			sum: element.quantity
		}
	})

	const mixedExpenses = [...emptyExpenses, ...realExpenses]

	const result = []
	const allLabelsInResult = []
	mixedExpenses.forEach((element) => {
		if (allLabelsInResult.includes(element.label)){
			result.forEach((item) => {
				if(item.label === element.label) {
					item.sum += element.sum
				}
			})
		} else {
			result.push(element)
			allLabelsInResult.push(element.label)
		}
	})

	result.forEach(month => {
		month.sum = trimDecimalPoints(month.sum)
	})

	return result
}

/**
 * Get name of category or subcategory using provided data.
 * @param {string} target 		MongoDB identifier of category or subcategory
 * @param {Array} categories 	Array with all categories and subcategories
 * @returns {string|null}
 */
const getNameOfCategoryOrSubcategory = (target, categories) => {
	if (target === null || categories.length === 0) {
		return null
	}

	let result = null

	categories.forEach(category => {
		if (category._id === target) {
			result = category.name
		}

		category.subcategories.forEach(subcategory =>{
			if (subcategory._id === target) {
				result = subcategory.name
			}
		})
	})

	return result
}

/**
 * This function groups all expenses by their subcategory
 * @requires trimDecimalPoints
 * @param {Array.<Object>} expensesInThisGroup - An array of objects
 * @param {string} expensesInThisGroup.category - An UUID value to identify a category
 * @param {string|null} expensesInThisGroup.subcategory - An UUID value to identify a subcategory or null
 * @param {number} expensesInThisGroup.quantity - An integer o float number
 * @param {string} expensesInThisGroup.date - A valid date with this format: '1514447205699'
 * @param {string} expensesInThisGroup.currencyISO - A currency. Example: 'EUR'
 * @param {string} expensesInThisGroup.uuid - An UUID value
 * @returns {Array.<Object>}
 */
const getParsedSubcategoriesInAGroup = (expensesInThisGroup) => {
	if (!expensesInThisGroup.length) {
		return []
	}

	const subcategoryMap = {}

	expensesInThisGroup.forEach(expense => {
		const { subcategory, category, quantity } = expense
		if (!subcategory) {
			return
		}

		if (!subcategoryMap[subcategory]) {
			subcategoryMap[subcategory] = {
				uuidParentCategory: category,
				idSubcategory: subcategory,
				totalInSubcategory: 0
			}
		}
		subcategoryMap[subcategory].totalInSubcategory += quantity
	})

	return Object.values(subcategoryMap).map(subcat => ({
		uuidParentCategory: subcat.uuidParentCategory,
		idSubcategory: subcat.idSubcategory,
		totalInSubcategory: trimDecimalPoints(subcat.totalInSubcategory)
	}))
}

/**
 * This function creates a DTO to be used to display the expenses data
 * @requires trimDecimalPoints
 * @param {string} label - Label to identify what is the content of expenses group
 * @param {float|integer} sum - The total quantity of a group
 * @param {Array.<Object>} [dataPerCategory=[]] - An optional array containing grouped expenses by category
 * @returns {Object}
 */
const expenseGroupDTO = (label, sum, dataPerCategory = []) => {
	return {
		groupTitle: label,
		groupTotal: trimDecimalPoints(sum),
		perCategory: [...dataPerCategory]
	}
}

/**
 * This function creates a DTO to be used to group all expenses on a category
 * @requires trimDecimalPoints
 * @param {string} uuid - The UUID of a category
 * @param {float|integer} quantity - The total quantity of a category
 * @param {Array.<Object>} [subcategoriesParsed=[]] - An optional array with expenses grouped by their subcategory
 *  @returns {Object}
 */
const categoryDTO = (uuid, quantity, subcategoriesParsed = []) => {
	return {
		idCategory: uuid,
		totalInCategory: trimDecimalPoints(quantity),
		perSubcategory: subcategoriesParsed
	}
}

/**
 * @requires getParsedSubcategoriesInAGroup
 * @requires categoryDTO
 * @param {Array.<Object>} expensesInThisGroup - An array of objects
 * @param {string} expensesInThisGroup.category - An UUID value to identify a category
 * @param {string|null} expensesInThisGroup.subcategory - An UUID value to identify a subcategory or null
 * @param {number} expensesInThisGroup.quantity - An integer o float number
 * @param {string} expensesInThisGroup.date - A valid date with this format: '1514447205699'
 * @param {string} expensesInThisGroup.currencyISO - A currency. Example: 'EUR'
 * @param {string} expensesInThisGroup.uuid - An UUID value
 * @returns {Array.<Object>}
 */
const getDataPerCategory = (expensesInThisGroup) => {
	const parsedSubcategoriesInThisGroup = getParsedSubcategoriesInAGroup(expensesInThisGroup)

	const listOfCategoryUUIDInThisGroup = []
	expensesInThisGroup.forEach(expense => {
		if (!listOfCategoryUUIDInThisGroup.includes(expense.category)) {
			listOfCategoryUUIDInThisGroup.push(expense.category)
		}
	})

	const dataPerCategory = listOfCategoryUUIDInThisGroup.map(category => {
		let quantity = 0
		expensesInThisGroup.forEach(expense => {
			if (expense.category === category) {
				quantity += expense.quantity
			}
		})

		const subcategories = parsedSubcategoriesInThisGroup.filter(subcategory => subcategory.uuidParentCategory === category)
		const subcategoriesParsed = subcategories.map(subcategory => {
			const result = {
				...subcategory
			}
			delete result.uuidParentCategory
			return result
		})

		return categoryDTO(category, quantity, subcategoriesParsed)
	})

	return dataPerCategory
}

/**
 * This function returns the total quantity of expenses group
 * @param {Array.<Object>} expensesInThisGroup - An array of objects
 * @param {string} expensesInThisGroup.category - An UUID value to identify a category
 * @param {string|null} expensesInThisGroup.subcategory - An UUID value to identify a subcategory or null
 * @param {number} expensesInThisGroup.quantity - An integer o float number
 * @param {string} expensesInThisGroup.date - A valid date with this format: '1514447205699'
 * @param {string} expensesInThisGroup.currencyISO - A currency. Example: 'EUR'
 * @param {string} expensesInThisGroup.uuid - An UUID value
 * @returns {float|integer}
 */
const getExpenseGroupTotal = (expensesInThisGroup) => {
	const groupTotal = expensesInThisGroup.reduce(function(accum, expense){
		return accum + expense.quantity
	}, 0)

	return groupTotal
}

/**
 * Returns the minimum and maximum dates found in an array of expenses.
 * Each expense must have a 'date' property, which can be a timestamp string or a date string.
 *
 * @param {Array.<Object>} expenses - An array of objects (the object must contain a date property)
 * @param {string} expenses.category - An UUID value to identify a category
 * @param {string|null} expenses.subcategory - An UUID value to identify a subcategory or null
 * @param {number} expenses.quantity - An integer o float number
 * @param {string} expenses.date - A valid date with this format: '1514447205699'
 * @param {string} expenses.currencyISO - A currency. Example: 'EUR'
 * @param {string} expenses.uuid - An UUID value
 * @returns {{ minDate: Date, maxDate: Date }} An object with the earliest and latest dates.
 */
const getMinAndMaxDateFromExpenses = (expenses = []) => {
	if (!expenses.length) {
		return { minDate: null, maxDate: null }
	}
	const dates = expenses.map(e =>
		new Date(Number.isNaN(+e.date) ? e.date : parseInt(e.date, 10))
	)
	const minDate = new Date(Math.min(...dates))
	const maxDate = new Date(Math.max(...dates))
	return { minDate, maxDate }
}



/**
 * Returns an array of Date objects representing the first day of each month
 * between two dates (inclusive).
 *
 * @param {Date} startDate - The start date.
 * @param {Date} endDate - The end date.
 * @returns {Array.<Date>} Array of Date objects, one for each month in the range.
 */
const listMonthsInRange = (startDate, endDate) => {
	const months = []
	let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
	const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1)
	while (current <= end) {
		months.push(new Date(current))
		current.setMonth(current.getMonth() + 1)
	}
	return months
}

/**
 * Groups an array of expenses by month (YYYY-MM).
 * Each expense must have a 'date' property, which can be a timestamp string or a date string.
 *
 * @param {Array.<Object>} expenses - Array of expense objects with a 'date' property.
 * @returns {Object} An object where keys are 'YYYY-MM' and values are arrays of expenses for that month.
 */
const groupExpensesByMonth = (expenses = []) => {
	const expensesByMonth = {}
	expenses.forEach(expense => {
		const dateObj = new Date(Number.isNaN(+expense.date) ? expense.date : parseInt(expense.date, 10))
		const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`
		if (!expensesByMonth[key]) expensesByMonth[key] = []
		expensesByMonth[key].push(expense)
	})
	return expensesByMonth
}

/**
 * This function performs a summation grouping the expenses by months. For each month, the categories of expenses are grouped. For each category their subcategories are also grouped
 * @requires getMinAndMaxDateFromExpenses
 * @requires listMonthsInRange
 * @requires groupExpensesByMonth
 * @requires getLocaleDateString
 * @requires expenseGroupDTO
 * @param {Array.<Object>} rawData - An array of objects (the object must contain a date property)
 * @param {string} rawData.category - An UUID value to identify a category
 * @param {string|null} rawData.subcategory - An UUID value to identify a subcategory or null
 * @param {number} rawData.quantity - An integer o float number
 * @param {string} rawData.date - A valid date with this format: '1514447205699'
 * @param {string} rawData.currencyISO - A currency. Example: 'EUR'
 * @param {string} rawData.uuid - An UUID value
 * @returns {Array.<Object>}
 */
const getDetailedExpensesPerMonth = (rawData = []) => {
	if (!rawData.length) {
		return []
	}

	const { minDate, maxDate } = getMinAndMaxDateFromExpenses(rawData)

	const months = listMonthsInRange(minDate, maxDate)

	const expensesByMonth = groupExpensesByMonth(rawData)

	return months.map(dateObj => {
		const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`
		const expenses = expensesByMonth[key] || []

		const categoryMap = {}
		let groupTotal = 0
		expenses.forEach(expense => {
			const { category, subcategory, quantity } = expense
			groupTotal += quantity
			if (!categoryMap[category]) {
				categoryMap[category] = { totalInCategory: 0, subcategories: {} }
			}
			categoryMap[category].totalInCategory += quantity
			if (subcategory) {
				if (!categoryMap[category].subcategories[subcategory]) {
					categoryMap[category].subcategories[subcategory] = 0
				}
				categoryMap[category].subcategories[subcategory] += quantity
			}
		})

		const perCategory = Object.entries(categoryMap).map(([idCategory, catData]) => ({
			idCategory,
			totalInCategory: trimDecimalPoints(catData.totalInCategory),
			perSubcategory: Object.entries(catData.subcategories).map(([idSubcategory, totalInSubcategory]) => ({
				idSubcategory,
				totalInSubcategory: trimDecimalPoints(totalInSubcategory)
			}))
		}))

		const groupTitle = getLocaleDateString(dateObj)
		return expenseGroupDTO(groupTitle, groupTotal, perCategory)
	})
}

/**
 * This function performs a summation grouping the expenses by category and subcategory for a range of months.
 * @requires getDataPerCategory
 * @requires getLocaleDateString
 * @requires getExpenseGroupTotal
 * @requires expenseGroupDTO
 * @param {Array.<Object>} expensesInThisGroup - An array of objects (the object must contain a date property)
 * @param {string} expensesInThisGroup.category - An UUID value to identify a category
 * @param {string|null} expensesInThisGroup.subcategory - An UUID value to identify a subcategory or null
 * @param {number} expensesInThisGroup.quantity - An integer o float number
 * @param {string} expensesInThisGroup.date - A valid date with this format: '1514447205699'
 * @param {string} expensesInThisGroup.currencyISO - A currency. Example: 'EUR'
 * @param {string} expensesInThisGroup.uuid - An UUID value
 * @param {string} startDate - The initial date of the range
 * @param {string} endDate - The end date of the range
 * @returns {Object | null}
 */
const getDetailedExpensesGroupedFromRange = (expensesInThisGroup = [], startDate = null, endDate = null) => {
	if (!expensesInThisGroup.length || !startDate || !endDate) {

		return null
	}

	const dataPerCategory = getDataPerCategory(expensesInThisGroup)

	const groupTotal = getExpenseGroupTotal(expensesInThisGroup)

	const startMonth = getLocaleDateString(startDate)
	const endMonth = getLocaleDateString(endDate)

	let title = `From ${startMonth} to ${endMonth}`
	if (startMonth === endMonth) {
		title = startMonth
	}

	return expenseGroupDTO(title, groupTotal, dataPerCategory)
}

/**
 * Returns a new array with the last 12 elements of original array. If the original array does not have a length of 12 or more, this function returns an empty array.
 * @param {Array} anArray - An array of any values
 * @returns {Array}
 */
const getLastTwelveValuesFromArrayIfTheyExist = (anArray) => {
	if (anArray.length < 12) {
		return []
	}

	return anArray.slice(-12)
}

/**
 * Returns the number of full months elapsed between two dates.
 *
 * A “full month” is counted only when the day of the `to` date is
 * greater than or equal to the day of the `from` date.  
 * Otherwise, the last month is not considered complete.
 *
 * @param {Date} from - The starting date.
 * @param {Date} to - The ending date.
 * @returns {number} The number of full months between the two dates.
 *
 * @example
 * monthsBetweenDates(new Date("2019-12-20"), new Date("2025-12-05"));
 * // → 71
 *
 * @example
 * monthsBetweenDates(new Date("2024-01-15"), new Date("2024-03-15"));
 * // → 2
 *
 * @example
 * monthsBetweenDates(new Date("2024-01-20"), new Date("2024-03-15"));
 * // → 1
 */
const monthsBetweenDates = (from, to) => {
  const years = to.getFullYear() - from.getFullYear()
  const months = to.getMonth() - from.getMonth()
  const total = years * 12 + months

  return to.getDate() >= from.getDate() ? total : total - 1
}


export {
	getNameOfCategoryOrSubcategory,
	getSumPerMonth,
	getDetailedExpensesPerMonth,
	getDetailedExpensesGroupedFromRange,
	getLastTwelveValuesFromArrayIfTheyExist,
	monthsBetweenDates
}
