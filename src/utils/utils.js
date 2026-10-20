/**
 * Get the calendar day of a stored spending date. Stored dates point at 12:00 UTC of their day, so they
 * are always read in UTC.
 * @example
 *   formatStoredDay('1772366400000') // '2026-03-01'
 * @param {string|number} timestamp Milliseconds since the epoch
 * @returns {string} YYYY-MM-DD
 */
const formatStoredDay = (timestamp) => {
	return new Date(Number(timestamp)).toISOString().substring(0, 10)
}

/**
* Calculate the first day of next month
* @example
*   firstDayOfNextMonth('2019-12-03') // 2020-01-01
* @param {string} date - Must represent a date with the same format as the example
* @returns {string}
*/
const firstDayOfNextMonth = (date) => {
	const parts = date.split('-')

	let year = parts[0]
	let month = parts[1]

	month++

	if (month == '13') { // eslint-disable-line eqeqeq
		year++
		month = '01'
	}

	if (month.toString().length < 2) {
		month = `0${month.toString()}`
	}

	return `${year}-${month}-01`
}

/**
* Calculate the first day of the month
* @example
*   firstDayOfTheMonth('2019-12-03') // 2019-12-01
* @param {string} date - Must represent a date with the same format as the example
* @returns {string}
*/
const firstDayOfTheMonth = (date) => {
	const parts = date.split('-')
	const year = parts[0]
	const month = parts[1]
	return `${year}-${month}-01`
}

/**
 * Trim an number to two decimal points
 * @param {number} number 
 * @returns {number}
 */
const trimDecimalPoints = (number) => {
	if (number === undefined || number === null) {
		return 0
	}

	const fixed = 2
	return Number(Number(number).toFixed(fixed))
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
 * Format a date as YYYY-MM-DD using its local calendar day.
 *
 * @param {Date} date
 * @returns {string}
 */
const formatIsoDate = (date) => {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

/**
 * Format a date as YYYY-MM using its local calendar month.
 *
 * @param {Date} date
 * @returns {string}
 */
const formatIsoMonth = (date) => {
	return formatIsoDate(date).substring(0, 7)
}

/**
 * Get the days from the 1st of the current month to today, both inclusive, on the device calendar.
 *
 * @param {Date} now
 * @returns {{ startDate: string, endDate: string }} Days as YYYY-MM-DD
 */
const getMonthToDateRange = (now) => {
	return { startDate: `${formatIsoMonth(now)}-01`, endDate: formatIsoDate(now) }
}

/**
 * Get the days of the 12 full months before the current one, both inclusive, on the device calendar.
 *
 * @param {Date} now
 * @returns {{ startDate: string, endDate: string }} Days as YYYY-MM-DD
 */
const getLastTwelveFullMonthsRange = (now) => {
	const monthsInAYear = 12
	const firstDay = new Date(now.getFullYear(), now.getMonth() - monthsInAYear, 1)
	const lastDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0)
	return { startDate: formatIsoDate(firstDay), endDate: formatIsoDate(lastDayOfPreviousMonth) }
}

/**
 * Return the local day-of-month (1-31) as an integer according to the user's current time zone.
 *
 * @example
 *   getLocalDay() // 3 (if today is 3rd in the user's locale)
 * @returns {number} The current day of the month in the user's local time zone.
 */
const getLocalDay = () => {
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

	const formatter = new Intl.DateTimeFormat('en-GB', {
		timeZone,
		day: 'numeric',
	})

	return parseInt(formatter.format(new Date()), 10)
}

/**
 * @const {Object.<string, number>} DATE_UNITS - Mapping of time units to their equivalent in seconds.
 */
const DATE_UNITS = {
	year: 31536000,
	month: 2592000,
	day: 86400,
	hour: 3600,
	minute: 60,
	second: 1
}

/**
 * Calculate the difference in seconds between the current time and a given timestamp.
 * @param {number} timestamp - The timestamp in milliseconds (e.g., from Date.now()).
 * @returns {number} The difference in seconds.
 */
const getSecondsDiff = (timestamp) => (Date.now() - timestamp) / 1000

/**
 * Determine the appropriate time unit and value for relative time formatting.
 * @param {number} secondsElapsed - The number of seconds elapsed.
 * @returns {Object} An object with 'value' (number) and 'unit' (string) properties.
 */
const getUnitAndValueDate = (secondsElapsed) => {
	for (const [unit, secondsInUnit] of Object.entries(DATE_UNITS)) {
		if (secondsElapsed >= secondsInUnit || unit === 'second') {
			const value = Math.floor(secondsElapsed / secondsInUnit) * -1
			return { value, unit }
		}
	}
}

/**
 * Get a human-readable relative time string (e.g., "2 hours ago") from a timestamp.
 * @param {number|string} timestamp - The timestamp in milliseconds (e.g., from Date.now()); the backend sends it as a string.
 * @param {string} [locale='en-GB'] - The locale for formatting the relative time (e.g., 'en-US', 'es-ES').
 * @returns {string} A localized relative time string.
 * @throws {RangeError} If the timestamp is missing or cannot be formatted.
 */
const getTimeAgo = (timestamp, locale = 'en-GB') => {
	if (timestamp === null || timestamp === undefined) {
		throw new RangeError('Invalid value at getTimeAgo function')
	}

	const rtf = new Intl.RelativeTimeFormat(locale, {
		numeric: 'auto',
		style: 'long',
	})

	const secondsElapsed = getSecondsDiff(timestamp)

	const { value, unit } = getUnitAndValueDate(secondsElapsed) || {}

	if (!Number.isFinite(value) || unit === undefined) {
		throw new RangeError('Invalid value at getTimeAgo function')
	}

	return rtf.format(value, unit)
}

export {
	formatStoredDay,
	firstDayOfNextMonth,
	firstDayOfTheMonth,
	trimDecimalPoints,
	startOfDay,
	getLocalDay,
	formatIsoDate,
	formatIsoMonth,
	getMonthToDateRange,
	getLastTwelveFullMonthsRange,
	getTimeAgo
}