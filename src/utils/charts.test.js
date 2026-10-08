import { shortMonthLabel } from './charts'

describe('shortMonthLabel', () => {
	it('shortens the month to three letters and keeps the full year', () => {
		expect(shortMonthLabel('September 2026')).toBe('Sep 2026')
	})

	it('leaves a month that is already three letters long unchanged', () => {
		expect(shortMonthLabel('May 2023')).toBe('May 2023')
	})
})
