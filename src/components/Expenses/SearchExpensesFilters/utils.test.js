import { parseAmount, startOfDay, endOfDay, buildSearchVariables } from './utils'

const emptyFilters = {
	category: '',
	subcategory: '',
	startDate: null,
	endDate: null,
	minQuantity: '',
	maxQuantity: '',
	sortBy: 'date',
	sortDirection: 'desc'
}

describe('parseAmount', () => {
	it('should parse a value written with a decimal point', () => {
		expect(parseAmount('23.15')).toBe(23.15)
	})

	it('should parse a value written with a decimal comma', () => {
		expect(parseAmount('23,15')).toBe(23.15)
	})

	it('should parse zero as a valid amount', () => {
		expect(parseAmount('0')).toBe(0)
	})

	it('should return undefined for an empty or blank value', () => {
		expect(parseAmount('')).toBeUndefined()
		expect(parseAmount('   ')).toBeUndefined()
	})

	it('should return undefined for a value that is not a number', () => {
		expect(parseAmount('abc')).toBeUndefined()
	})
})

describe('startOfDay and endOfDay', () => {
	it('should move a date to the very beginning of its day', () => {
		const result = startOfDay(new Date(2026, 1, 1, 17, 42, 13, 500))

		expect(result.getFullYear()).toBe(2026)
		expect(result.getMonth()).toBe(1)
		expect(result.getDate()).toBe(1)
		expect(result.getHours()).toBe(0)
		expect(result.getMinutes()).toBe(0)
		expect(result.getSeconds()).toBe(0)
		expect(result.getMilliseconds()).toBe(0)
	})

	it('should move a date to the very end of its day', () => {
		const result = endOfDay(new Date(2026, 3, 30, 8, 5, 0, 0))

		expect(result.getDate()).toBe(30)
		expect(result.getHours()).toBe(23)
		expect(result.getMinutes()).toBe(59)
		expect(result.getSeconds()).toBe(59)
		expect(result.getMilliseconds()).toBe(999)
	})

	it('should not mutate the date received', () => {
		const original = new Date(2026, 1, 1, 17, 42, 13, 500)

		startOfDay(original)

		expect(original.getHours()).toBe(17)
	})
})

describe('buildSearchVariables', () => {
	it('should always send page, pageSize and sorting', () => {
		const variables = buildSearchVariables(emptyFilters, 2, 25)

		expect(variables.page).toBe(2)
		expect(variables.pageSize).toBe(25)
		expect(variables.sortBy).toBe('date')
		expect(variables.sortDirection).toBe('desc')
	})

	it('should omit every filter that is not filled in', () => {
		const variables = buildSearchVariables(emptyFilters, 1, 25)

		expect('category' in variables).toBe(false)
		expect('subcategory' in variables).toBe(false)
		expect('startDate' in variables).toBe(false)
		expect('endDate' in variables).toBe(false)
		expect('minQuantity' in variables).toBe(false)
		expect('maxQuantity' in variables).toBe(false)
	})

	it('should send the identifiers of category and subcategory when they are selected', () => {
		const filters = { ...emptyFilters, category: 'category-id-1', subcategory: 'subcategory-id-1' }

		const variables = buildSearchVariables(filters, 1, 25)

		expect(variables.category).toBe('category-id-1')
		expect(variables.subcategory).toBe('subcategory-id-1')
	})

	it('should send the start date at the beginning of the day and the end date at the end of the day', () => {
		const filters = { ...emptyFilters, startDate: new Date(2026, 1, 1), endDate: new Date(2026, 3, 30) }

		const variables = buildSearchVariables(filters, 1, 25)

		expect(variables.startDate).toBe('2026-01-31T23:00:00.000Z')
		expect(variables.endDate).toBe('2026-04-30T21:59:59.999Z')
	})

	it('should send an amount of zero instead of dropping it', () => {
		const filters = { ...emptyFilters, minQuantity: '0', maxQuantity: '0' }

		const variables = buildSearchVariables(filters, 1, 25)

		expect(variables.minQuantity).toBe(0)
		expect(variables.maxQuantity).toBe(0)
	})

	it('should send the same value on both ends when searching an exact amount', () => {
		const filters = { ...emptyFilters, minQuantity: '23,15', maxQuantity: '23,15' }

		const variables = buildSearchVariables(filters, 1, 25)

		expect(variables.minQuantity).toBe(23.15)
		expect(variables.maxQuantity).toBe(23.15)
	})

	it('should never send an empty string, because the backend rejects it', () => {
		const variables = buildSearchVariables(emptyFilters, 1, 25)

		expect(Object.values(variables)).not.toContain('')
	})
})
