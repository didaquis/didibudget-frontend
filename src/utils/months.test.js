import { MONTHS, formatMonth, monthKey, nextMonth } from './months'

describe('MONTHS', () => {
	test('lists the twelve months in calendar order with enum value and label', () => {
		expect(MONTHS.map(({ value }) => value)).toEqual(['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'])
		expect(MONTHS.map(({ label }) => label)).toEqual(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
	})
})

describe('formatMonth', () => {
	test('returns the month name followed by the year', () => {
		expect(formatMonth({ year: 2026, month: 'JANUARY' })).toBe('January 2026')
		expect(formatMonth({ year: 2021, month: 'SEPTEMBER' })).toBe('September 2021')
	})

	test('throws for a value that is not a month', () => {
		expect(() => formatMonth({ year: 2026, month: 'January' })).toThrow('Unknown month: January')
	})
})

describe('monthKey', () => {
	test('returns a zero-padded year-month key', () => {
		expect(monthKey({ year: 2021, month: 'AUGUST' })).toBe('2021-08')
		expect(monthKey({ year: 2021, month: 'DECEMBER' })).toBe('2021-12')
	})

	test('keys sort in calendar order', () => {
		const keys = [
			monthKey({ year: 2022, month: 'JANUARY' }),
			monthKey({ year: 2021, month: 'DECEMBER' }),
			monthKey({ year: 2021, month: 'FEBRUARY' }),
		]
		expect([...keys].sort()).toEqual(['2021-02', '2021-12', '2022-01'])
	})

	test('throws for a value that is not a month', () => {
		expect(() => monthKey({ year: 2026, month: 'FOO' })).toThrow('Unknown month: FOO')
	})
})

describe('nextMonth', () => {
	test('returns the following month in the same year', () => {
		expect(nextMonth({ year: 2021, month: 'AUGUST' })).toEqual({ year: 2021, month: 'SEPTEMBER' })
	})

	test('rolls December over to January of the next year', () => {
		expect(nextMonth({ year: 2021, month: 'DECEMBER' })).toEqual({ year: 2022, month: 'JANUARY' })
	})

	test('throws for a value that is not a month', () => {
		expect(() => nextMonth({ year: 2021, month: 13 })).toThrow('Unknown month: 13')
	})
})
