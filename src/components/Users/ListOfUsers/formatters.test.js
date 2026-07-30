import { formatTimeAgo } from './formatters'

describe('formatTimeAgo', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('formats a timestamp as relative time', () => {
		const now = Date.now()
		vi.setSystemTime(now)

		expect(formatTimeAgo(now - 2 * 60 * 60 * 1000, 'Never')).toBe('2 hours ago')
	})

	it('returns the fallback when the timestamp is null', () => {
		expect(formatTimeAgo(null, 'Never')).toBe('Never')
	})

	it('returns the fallback when the timestamp is undefined', () => {
		expect(formatTimeAgo(undefined, 'Never')).toBe('Never')
	})

	it('does not swallow an actually invalid timestamp', () => {
		vi.setSystemTime(Date.now())

		expect(() => formatTimeAgo('invalid', 'Never')).toThrow(RangeError)
	})
})
