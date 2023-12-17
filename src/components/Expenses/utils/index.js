import { firstDayOfNextMonth, firstDayOfTheMonth, parseUnixTimestamp, trimDecimalPoints } from '../../../utils/utils'

/**
 * Get name of month and year from a date
 * @example
 * 	getLocaleDateString('2020-12-01'); // December 2020
 * @param {string} date - Example: '2020-12-01'
 * @returns {string}
 */
const getLocaleDateString = (date) => {
	return new Date(date).toLocaleDateString('en-EN', { year: 'numeric', month: 'long' })
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
* Parse the data of expenses to obtain an array of sum per month. This function refill the empty data of every month and do a sum of every months. Moreover, we discard the current month and refill the results until the second last month
* @requires getSumPerMonth
* @requires parseUnixTimestamp
* @example
* 	const data = [{quantity: 3, date: '2020-10-31'}, {quantity: 99.03, date: '2020-10-31'}, {quantity: 2.45, date: '2020-12-07'}]
* 	getAveragePerMonth(data) // [102.03, 0, 2.45, 0, 0, 0, 0, 0]
* @param {Array.<Object>} data - An array of objects
* @param {string} data.date - A valid date with this format '2018-03-01'
* @param {float|integer} data.quantity
* @returns {Array.<number>}
*/
const getAveragePerMonth = (data = []) => {
	if (!data.length) {
		return []
	}

	const today = parseUnixTimestamp(new Date(Date.now()).getTime()).substring(0, 10)
	const currentlyMonth = { quantity: 0, date: today }
	const completedData = [...data]
	completedData.push(currentlyMonth)

	const totalPerMonth = getSumPerMonth(completedData)
	totalPerMonth.pop()	

	return totalPerMonth.map(month => {
		return month.sum
	})
}


/**
 * Get the average value of a list of integers (rounded decimals). This function only takes into account the last "x" values on the array.
 * @requires trimDecimalPoints
 * @param {Array<Integer>} listOfData - array with the data
 * @param {Integer} numberOfPositions - number of last positions to use
 * @returns {number | null}
 */
const averageOfLast = (listOfData = [], numberOfPositions) => {
	if (!Number.isInteger(numberOfPositions) || numberOfPositions < 1) {
		throw new Error('You must specify the number of data to take into account in the average')
	}

	if (listOfData.length < numberOfPositions) {
		return null
	}

	const selectedData = listOfData.slice(- numberOfPositions)
	const average = selectedData.reduce((acc,v) => acc + v) / selectedData.length

	return trimDecimalPoints(average)
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
	const listOfSubcategoriesInThisGroup = []
	expensesInThisGroup.forEach(expense => {
		if (!listOfSubcategoriesInThisGroup.includes(expense.subcategory)) {
			listOfSubcategoriesInThisGroup.push(expense.subcategory)
		}
	})

	const totalExpensePerSubcategory = []
	listOfSubcategoriesInThisGroup.forEach(subcategory => {
		if (subcategory) {
			let quantity = 0
			let uuidParentCategory
			expensesInThisGroup.forEach(expense => {
				if (expense.subcategory === subcategory) {
					quantity += expense.quantity
					uuidParentCategory = expense.category
				}
			})
			totalExpensePerSubcategory.push({
				uuidParentCategory: uuidParentCategory,
				idSubcategory: subcategory,
				totalInSubcategory: trimDecimalPoints(quantity)
			})
		}
	})

	return totalExpensePerSubcategory
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
 * This function performs a summation grouping the expenses by months. For each month, the categories of expenses are grouped. For each category their subcategories are also grouped
 * @requires trimDecimalPoints
 * @requires getSumPerMonth
 * @requires expenseGroupDTO
 * @requires categoryDTO
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

	const data = rawData.map(expense => {
		return {
			...expense,
			date: parseUnixTimestamp(expense.date).substring(0, 10)
		}
	})

	const sumPerMonth = getSumPerMonth(data)

	const parsedMonths = sumPerMonth.map(month => {
		return expenseGroupDTO(month.label, month.sum)
	})

	const parsedMonthsWithCategoriesAndSubcategories = parsedMonths.map(month => {

		const expensesInThisGroup = data.filter(expense => {
			return getLocaleDateString(expense.date) === month.groupTitle
		})

		const parsedSubcategoriesInThisGroup = getParsedSubcategoriesInAGroup(expensesInThisGroup)

		const listOfCategoryUUIDInThisGroup = []
		expensesInThisGroup.forEach(expense => {
			if (!listOfCategoryUUIDInThisGroup.includes(expense.category)) {
				listOfCategoryUUIDInThisGroup.push(expense.category)
			}
		})

		const totalExpensePerCategory = listOfCategoryUUIDInThisGroup.map(category => {
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

		return {
			...month,
			perCategory: totalExpensePerCategory
		}
	})

	return parsedMonthsWithCategoriesAndSubcategories
}

/**
 * This function performs a summation grouping the expenses by category and subcategory for a range of months.
 * @requires trimDecimalPoints
 * @requires getLocaleDateString
 * @requires expenseGroupDTO
 * @requires categoryDTO
 * @param {Array.<Object>} expensesInThisGroup - An array of objects (the object must contain a date property)
 * @param {string} expensesInThisGroup.category - An UUID value to identify a category
 * @param {string|null} expensesInThisGroup.subcategory - An UUID value to identify a subcategory or null
 * @param {number} expensesInThisGroup.quantity - An integer o float number
 * @param {string} expensesInThisGroup.date - A valid date with this format: '1514447205699'
 * @param {string} expensesInThisGroup.currencyISO - A currency. Example: 'EUR'
 * @param {string} expensesInThisGroup.uuid - An UUID value
 * @param {Date} startDate - The initial date of the range
 * @param {Date} endDate - The end date of the range
 * @returns {Object | null}
 */
const getDetailedExpensesGroupedFromRange = (expensesInThisGroup = [], startDate = null, endDate = null) => {
	if (!expensesInThisGroup.length || !startDate || !endDate) {

		return null
	}

	const parsedSubcategoriesInThisGroup = getParsedSubcategoriesInAGroup(expensesInThisGroup)

	const listOfCategoryUUIDInThisGroup = []
	expensesInThisGroup.forEach(expense => {
		if (!listOfCategoryUUIDInThisGroup.includes(expense.category)) {
			listOfCategoryUUIDInThisGroup.push(expense.category)
		}
	})

	const totalExpensePerCategory = listOfCategoryUUIDInThisGroup.map(category => {
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

	const groupTotal = expensesInThisGroup.reduce(function(accum, expense){
		return accum + expense.quantity
	}, 0)

	return expenseGroupDTO(`From ${getLocaleDateString(startDate)} to ${getLocaleDateString(endDate)}`, groupTotal, totalExpensePerCategory)
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

export {
	getNameOfCategoryOrSubcategory,
	getSumPerMonth,
	getDetailedExpensesPerMonth,
	getDetailedExpensesGroupedFromRange,
	getAveragePerMonth,
	averageOfLast,
	getLastTwelveValuesFromArrayIfTheyExist,
}
