/**
 * Months as the backend Month enum (value) and as shown to the user (label), in calendar order
 * @type {Array.<{value: string, label: string}>}
 */
const MONTHS = [
	{ value: 'JANUARY', label: 'January' },
	{ value: 'FEBRUARY', label: 'February' },
	{ value: 'MARCH', label: 'March' },
	{ value: 'APRIL', label: 'April' },
	{ value: 'MAY', label: 'May' },
	{ value: 'JUNE', label: 'June' },
	{ value: 'JULY', label: 'July' },
	{ value: 'AUGUST', label: 'August' },
	{ value: 'SEPTEMBER', label: 'September' },
	{ value: 'OCTOBER', label: 'October' },
	{ value: 'NOVEMBER', label: 'November' },
	{ value: 'DECEMBER', label: 'December' },
]

const indexOfMonth = (month) => {
	const index = MONTHS.findIndex(({ value }) => value === month)
	if (index === -1) {
		throw new Error(`Unknown month: ${month}`)
	}
	return index
}

/**
 * @example
 *   formatMonth({ year: 2026, month: 'JANUARY' }) // 'January 2026'
 * @param {{year: number, month: string}} monthOfYear
 * @returns {string}
 */
const formatMonth = ({ year, month }) => `${MONTHS[indexOfMonth(month)].label} ${year}`

/**
 * Sortable key of a month
 * @example
 *   monthKey({ year: 2021, month: 'AUGUST' }) // '2021-08'
 * @param {{year: number, month: string}} monthOfYear
 * @returns {string}
 */
const monthKey = ({ year, month }) => `${year}-${String(indexOfMonth(month) + 1).padStart(2, '0')}`

/**
 * @example
 *   nextMonth({ year: 2021, month: 'DECEMBER' }) // { year: 2022, month: 'JANUARY' }
 * @param {{year: number, month: string}} monthOfYear
 * @returns {{year: number, month: string}}
 */
const nextMonth = ({ year, month }) => {
	const index = indexOfMonth(month)
	if (index === MONTHS.length - 1) {
		return { year: year + 1, month: MONTHS[0].value }
	}
	return { year, month: MONTHS[index + 1].value }
}

export {
	MONTHS,
	formatMonth,
	monthKey,
	nextMonth,
}
