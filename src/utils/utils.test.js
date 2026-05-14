import { parseUnixTimestamp, firstDayOfNextMonth, firstDayOfTheMonth, trimDecimalPoints, getFirstParamFromSplat, getLocalDay, getTimeAgo } from './utils'

describe('parseUnixTimestamp', () => {
	test('should return a valid date in a human readable format', () => {
		const timestamp = 1588197712263

		const result = parseUnixTimestamp(timestamp)

		expect(result).toBe('2020-04-30 00:01')
	})

	test('should return another valid date in a human readable format', () => {
		const timestamp = 1479798793044

		const result = parseUnixTimestamp(timestamp)

		expect(result).toBe('2016-11-22 08:13')
	})
})

describe('firstDayOfNextMonth', () => {
	test('should return an string represent the first day on next month', () => {
		const date = '2019-12-03'
		const expectedResult = '2020-01-01'
		expect(firstDayOfNextMonth(date)).toBe(expectedResult)
	})

	test('should return an string represent the first day on next month even in a future date', () => {
		const date = '2073-01-07'
		const expectedResult = '2073-02-01'
		expect(firstDayOfNextMonth(date)).toBe(expectedResult)
	})
})

describe('firstDayOfTheMonth', () => {
	test('should return an string with represent the first day of the month', () => {
		const date = '2019-12-07'
		const expectedResult = '2019-12-01'
		expect(firstDayOfTheMonth(date)).toBe(expectedResult)
	})

	test('should return an string with represent the first day of the month even in future', () => {
		const date = '2073-01-07'
		const expectedResult = '2073-01-01'
		expect(firstDayOfTheMonth(date)).toBe(expectedResult)
	})

	test('should return an string with represent the first day of the month even when receive a date that already is the first day of month', () => {
		const date = '2020-06-01'
		const expectedResult = '2020-06-01'
		expect(firstDayOfTheMonth(date)).toBe(expectedResult)
	})
})

describe('trimDecimalPoints', () => {
	test('should return 0', () => {
		const result = trimDecimalPoints(0)
		expect(result).toEqual(0)
	})

	test('should return 0 if no receive any parameter', () => {
		const result = trimDecimalPoints()
		expect(result).toEqual(0)
	})

	test('should return an integer if receive an integer', () => {
		const result = trimDecimalPoints(7)
		expect(result).toEqual(7)
	})

	test('should return a float number with two decimals if receive a float with more than two decimals', () => {
		const result = trimDecimalPoints(1.23000001)
		expect(result).toEqual(1.23)
	})

	test('should return a float number with one decimal if receive a float with one decimal', () => {
		const result = trimDecimalPoints(4.2)
		expect(result).toEqual(4.2)
	})

	test('should return a float number with one decimal if receive a float with one decimal', () => {
		const result = trimDecimalPoints(5.01)
		expect(result).toEqual(5.01)
	})

	test('should return a negative float number with two decimals if receive a negative float with more than two decimals', () => {
		const result = trimDecimalPoints(-34.200000006)
		expect(result).toEqual(-34.2)
	})
})

describe('getFirstParamFromSplat', () => {
	test('should return null if no receive any parameter', () => {
		const result = getFirstParamFromSplat()
		expect(result).toBeNull()
	})

	test('should return null if receive an empty string as parameter', () => {
		const result = getFirstParamFromSplat('')
		expect(result).toBeNull()
	})

	test('should return all chars before the first slash', () => {
		const result = getFirstParamFromSplat('5ea7113296474318495ba3e5/discarted/text')
		expect(result).toEqual('5ea7113296474318495ba3e5')
	})

	test('should return all chars if there are not any slash', () => {
		const result = getFirstParamFromSplat('47433e518495ea71132965ba')
		expect(result).toEqual('47433e518495ea71132965ba')
	})
})

describe('getLocalDay', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	test('should returns 3 when current date is November 3, 2025', () => {
		vi.setSystemTime(new Date('2025-11-03T12:00:00'))
		expect(getLocalDay()).toBe(3)
	})

	test('should returns 4 when current date is November 4, 2025', () => {
		vi.setSystemTime(new Date('2025-11-04T01:00:00'))
		expect(getLocalDay()).toBe(4)
	})

	test('should returns number between 1 and 31', () => {
		vi.setSystemTime(new Date('2025-11-15T10:00:00'))
		const result = getLocalDay()
		expect(result).toBeGreaterThanOrEqual(1)
		expect(result).toBeLessThanOrEqual(31)
	})

	test('should handles edge of month', () => {
		vi.setSystemTime(new Date('2025-11-30T23:59:59'))
		expect(getLocalDay()).toBe(30)
	})
})

describe('getTimeAgo', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	test('should return "2 hours ago" for a timestamp 2 hours in the past', () => {
		const now = Date.now()
		vi.setSystemTime(now)
		const twoHoursAgo = now - 2 * 60 * 60 * 1000

		const result = getTimeAgo(twoHoursAgo)
		expect(result).toBe('2 hours ago')
	})

	test('should return "yesterday" for a timestamp 1 day in the past', () => {
		const now = Date.now()
		vi.setSystemTime(now)
		const oneDayAgo = now - 24 * 60 * 60 * 1000

		const result = getTimeAgo(oneDayAgo)
		expect(result).toBe('yesterday')
	})

	test('should return "30 seconds ago" for a timestamp 30 seconds in the past', () => {
		const now = Date.now()
		vi.setSystemTime(now)
		const thirtySecondsAgo = now - 30 * 1000

		const result = getTimeAgo(thirtySecondsAgo)
		expect(result).toBe('30 seconds ago')
	})

	test('should use the provided locale for formatting', () => {
		const now = Date.now()
		vi.setSystemTime(now)
		const twoHoursAgo = now - 2 * 60 * 60 * 1000

		const result = getTimeAgo(twoHoursAgo, 'es-ES')
		expect(result).toBe('hace 2 horas')
	})

	test('should throw RangeError for invalid timestamp', () => {
		vi.setSystemTime(Date.now())

		expect(() => getTimeAgo('invalid')).toThrow(RangeError)
	})
})