import { dateLocalizer } from './dateLocalizer'

describe('dateLocalizer', () => {
	it('starts the week on Monday', () => {
		expect(dateLocalizer.firstOfWeek()).toBe(1)
	})

	it('names weekdays with two letters', () => {
		expect(dateLocalizer.weekday(new Date(2026, 9, 12))).toBe('Mo')
		expect(dateLocalizer.weekday(new Date(2026, 9, 13))).toBe('Tu')
	})

	it('formats a date in US order with a four-digit year', () => {
		expect(dateLocalizer.date(new Date(2026, 8, 5))).toBe('09/05/2026')
	})

	it('formats the calendar header as short month and year', () => {
		expect(dateLocalizer.header(new Date(2026, 9, 13))).toBe('Oct 2026')
	})

	it('still honours an explicit format', () => {
		expect(dateLocalizer.weekday(new Date(2026, 9, 12), { weekday: 'long' })).toBe('Monday')
	})
})
