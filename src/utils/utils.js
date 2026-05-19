/**
 * Convert an Unix timestamp to human readable datetime (local time zone)
 * @param {string|number} timestamp
 * @returns {string}
 */
const parseUnixTimestamp = (timestamp) => {
	timestamp = parseInt(timestamp)
	const d = new Date(timestamp)

	let month = `${(d.getMonth() + 1)}`
	let day = `${d.getDate()}`
	const year = d.getFullYear()
	let hour = `${d.getHours()}`
	let minute = `${d.getMinutes()}`

	if (month.length < 2) { month = `0${month}` }
	if (day.length < 2) { day = `0${day}` }
	if (hour.length < 2) { hour = `0${hour}` }
	if (minute.length < 2) { minute = `0${minute}` }

	const date = [year, month, day].join('-')
	const time = [hour, minute].join(':')

	return `${date} ${time}`
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
 * This function splits a string and returns all the characters it finds before a slash
 * @example
 *   getFirstParamFromSplat('5ea7113296474318495ba3e5/discarted/text') //'5ea7113296474318495ba3e5'
 *   getFirstParamFromSplat('') // null
 * @param {string} splat
 * @returns {string|null}
 */
const getFirstParamFromSplat = (splat) => {
	if (!splat) {
		return null
	}

	return splat.split('/')[0]
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
 * @param {number} timestamp - The timestamp in milliseconds (e.g., from Date.now()).
 * @param {string} [locale='en-UK'] - The locale for formatting the relative time (e.g., 'en-US', 'es-ES').
 * @returns {string} A localized relative time string.
 */
const getTimeAgo = (timestamp, locale = 'en-UK') => {
	const rtf = new Intl.RelativeTimeFormat(locale, {
		numeric: 'auto',
		style: 'long',
	})

	const secondsElapsed = getSecondsDiff(timestamp)

	const { value, unit } = getUnitAndValueDate(secondsElapsed) || {}

	if (value === undefined || unit === undefined) {
		throw new RangeError('Invalid value at getTimeAgo function')
	}

	return rtf.format(value, unit)
}

export {
	parseUnixTimestamp,
	firstDayOfNextMonth,
	firstDayOfTheMonth,
	trimDecimalPoints,
	getFirstParamFromSplat,
	getLocalDay,
	getTimeAgo
}