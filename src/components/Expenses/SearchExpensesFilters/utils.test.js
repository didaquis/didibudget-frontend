import { parseAmount, buildSearchVariables, isValidAmountInput, buildFiltersSummary } from './utils'

const categories = [
	{
		_id: 'category-id-1',
		name: 'Private vehicles',
		uuid: 'category-uuid-1',
		subcategories: [
			{ _id: 'subcategory-id-1', name: 'Fuel', uuid: 'subcategory-uuid-1' }
		]
	},
	{
		_id: 'category-id-2',
		name: 'Home',
		uuid: 'category-uuid-2',
		subcategories: []
	}
]

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

describe('isValidAmountInput', () => {
	it('should accept an empty value', () => {
		expect(isValidAmountInput('')).toBe(true)
	})

	it('should accept a blank value', () => {
		expect(isValidAmountInput('   ')).toBe(true)
	})

	it('should accept a value written with a decimal point', () => {
		expect(isValidAmountInput('23.15')).toBe(true)
	})

	it('should accept a value written with a decimal comma', () => {
		expect(isValidAmountInput('23,15')).toBe(true)
	})

	it('should accept zero', () => {
		expect(isValidAmountInput('0')).toBe(true)
	})

	it('should reject a negative number', () => {
		expect(isValidAmountInput('-5')).toBe(false)
	})

	it('should reject a value with more than one decimal separator', () => {
		expect(isValidAmountInput('1.234,56')).toBe(false)
	})

	it('should reject a value with a stray character', () => {
		expect(isValidAmountInput('12€')).toBe(false)
	})

	it('should reject a value that is not a number', () => {
		expect(isValidAmountInput('abc')).toBe(false)
	})
})

describe('buildFiltersSummary', () => {
	it('should say "All categories" when no category is selected', () => {
		expect(buildFiltersSummary(emptyFilters, categories)).toBe('All categories')
	})

	it('should include the category name when a category is selected', () => {
		const filters = { ...emptyFilters, category: 'category-id-1' }

		expect(buildFiltersSummary(filters, categories)).toBe('Private vehicles')
	})

	it('should include the category and subcategory names when a subcategory is selected', () => {
		const filters = { ...emptyFilters, category: 'category-id-1', subcategory: 'subcategory-id-1' }

		expect(buildFiltersSummary(filters, categories)).toBe('Private vehicles - Fuel')
	})

	it('should omit the date part when neither date is set', () => {
		expect(buildFiltersSummary(emptyFilters, categories)).not.toContain('to')
	})

	it('should describe a date range when both dates are set', () => {
		const filters = { ...emptyFilters, startDate: new Date(2026, 0, 1), endDate: new Date(2026, 5, 30) }

		expect(buildFiltersSummary(filters, categories)).toBe('All categories · 2026-01-01 to 2026-06-30')
	})

	it('should describe an open-ended start date', () => {
		const filters = { ...emptyFilters, startDate: new Date(2026, 0, 1) }

		expect(buildFiltersSummary(filters, categories)).toBe('All categories · from 2026-01-01')
	})

	it('should describe an open-ended end date', () => {
		const filters = { ...emptyFilters, endDate: new Date(2026, 5, 30) }

		expect(buildFiltersSummary(filters, categories)).toBe('All categories · until 2026-06-30')
	})

	it('should omit the amount part when neither amount is set', () => {
		expect(buildFiltersSummary(emptyFilters, categories)).toBe('All categories')
	})

	it('should describe an amount range when both amounts are set, using the raw strings typed', () => {
		const filters = { ...emptyFilters, minQuantity: '10', maxQuantity: '20,50' }

		expect(buildFiltersSummary(filters, categories)).toBe('All categories · 10 to 20,50')
	})

	it('should describe an open-ended minimum amount', () => {
		const filters = { ...emptyFilters, minQuantity: '10' }

		expect(buildFiltersSummary(filters, categories)).toBe('All categories · from 10')
	})

	it('should describe an open-ended maximum amount', () => {
		const filters = { ...emptyFilters, maxQuantity: '20,50' }

		expect(buildFiltersSummary(filters, categories)).toBe('All categories · up to 20,50')
	})

	it('should join category, date and amount parts together', () => {
		const filters = {
			...emptyFilters,
			category: 'category-id-1',
			startDate: new Date(2026, 0, 1),
			endDate: new Date(2026, 5, 30),
			minQuantity: '10',
			maxQuantity: '20,50'
		}

		expect(buildFiltersSummary(filters, categories)).toBe('Private vehicles · 2026-01-01 to 2026-06-30 · 10 to 20,50')
	})
})
