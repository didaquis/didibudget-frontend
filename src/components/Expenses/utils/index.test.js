import { getNameOfCategoryOrSubcategory, getSumPerMonth, getDetailedExpensesPerMonth, getDetailedExpensesGroupedFromRange } from './index'

import {
	expensesRawData,
	expectedData,
	expensesRawDataForGetDetailedExpendesPerMonth,
	expectedDataForGetDetailedExpendesPerMonth,
	expensesRawDataForGetDetailedExpensesGroupedFromRange,
	expectedDataForGetDetailedExpensesGroupedFromRange,
	expectedDataForGetDetailedExpensesGroupedFromRangeOnCurrentMonth
} from './fixtures'


describe('getNameOfCategoryOrSubcategory', () => {
	let categories

	beforeEach(() => {
		categories = [
			{
				'_id': '4f14ca',
				'name': 'foo',
				'subcategories': [],
				'uuid': 'a39e-2f76b6d785bb',
				'__typename': 'ExpenseCategory'
			},
			{
				'_id': '4f14cc',
				'name': 'bar',
				'subcategories': [],
				'uuid': '9d0b-08f8bc3d87ff',
				'__typename': 'ExpenseCategory'
			},
			{
				'_id': '4f14d7',
				'name': 'biz',
				'subcategories': [
					{
						'_id': '5ba3e5',
						'name': 'biz biz',
						'uuid': '850a-2ebd108fdc22',
						'__typename': 'ExpenseSubcategory'
					},
					{
						'_id': '4f14b4',
						'name': 'biz biz biz',
						'uuid': '926e-d67452749ede',
						'__typename': 'ExpenseSubcategory'
					},
				],
				'uuid': '8845-70e0ff94c1b4',
				'__typename': 'ExpenseCategory'
			}]
	})


	test('should return null if receive null as first parameter', () => {
		const target = null

		const result = getNameOfCategoryOrSubcategory(target, categories)

		expect(result).toBeNull()
	})

	test('should return null if receive an empty array as second parameter', () => {
		const target = '4f14ca'
		categories = []

		const result = getNameOfCategoryOrSubcategory(target, categories)

		expect(result).toBeNull()
	})

	test('should return null if the id is not on the array', () => {
		const target = '77777'

		const result = getNameOfCategoryOrSubcategory(target, categories)

		expect(result).toBeNull()
	})

	test('should return the name of category if it is on the array', () => {
		const target = '4f14ca'

		const result = getNameOfCategoryOrSubcategory(target, categories)

		expect(result).toBe('foo')
	})

	test('should return the name of subcategory if it is on the array', () => {
		const target = '5ba3e5'

		const result = getNameOfCategoryOrSubcategory(target, categories)

		expect(result).toBe('biz biz')
	})
})


describe('getSumPerMonth', () => {
	test('should return an array', () => {
		expect(getSumPerMonth()).toEqual([])
	})

	test('should return an array of objects with properties "label" and "sum" if receive an array of valid data with at least one object', () => {
		expect.hasAssertions()
		const result = getSumPerMonth(expensesRawData)

		result.forEach(element => {
			expect(element.label).toBeDefined()
			expect(typeof element.label).toBe('string')
			expect(element.sum).toBeDefined()
			expect(typeof element.sum).toBe('number')
			expect(element.sum).not.toBeNaN()
		})
	})

	test('should return an array of objects with a sum of quantity per month', () => {
		const result = getSumPerMonth(expensesRawData)

		expect(result).toEqual(expectedData)
	})

	test('should fill the gap of months without data', () => {
		const data = [{'quantity': 3, 'date': '2020-10-21'},{'quantity': 99.03, 'date': '2020-10-31'}, {'quantity': 2.45, 'date': '2020-12-07'}]
		const result = getSumPerMonth(data)

		const expected = [{ label: 'October 2020', sum: 102.03 }, { label: 'November 2020', sum: 0 }, { label: 'December 2020', sum: 2.45 }]
		expect(result).toEqual(expected)
	})

	test('should fill the gap of several months without data', () => {
		const data = [
			{
				'category': '5e64ec217048af874c4f14cd',
				'subcategory': null,
				'quantity': 12,
				'date': '2020-10-31',
				'currencyISO': 'EUR',
				'uuid': '040b7060-6322-4cf7-9f52-2cacd5c0be10',
				'__typename': 'Expense'
			},
			{
				'category': '5e64ec217048af874c4f14d6',
				'subcategory': '5e64ec217048af874c4f14b1',
				'quantity': 12.01,
				'date': '2021-02-10',
				'currencyISO': 'EUR',
				'uuid': '0363b8bc-c40c-401b-b285-2f7bc58ba210',
				'__typename': 'Expense'
			}
		]

		const expected = [ { label: 'October 2020', sum: 12 }, { label: 'November 2020', sum: 0 }, { label: 'December 2020', sum: 0 }, { label: 'January 2021', sum: 0 }, { label: 'February 2021', sum: 12.01 } ]

		const result = getSumPerMonth(data)
		expect(result).toEqual(expected)
	})
})

describe('getDetailedExpensesPerMonth', () => {
	test('should return an empty array if no receive params', () => {
		const result = getDetailedExpensesPerMonth()

		expect(Array.isArray(result)).toBe(true)
		expect(result).toEqual([])
	})

	test('should return an empty array if receive an empty array', () => {
		const result = getDetailedExpensesPerMonth([])

		expect(Array.isArray(result)).toBe(true)
		expect(result).toEqual([])
	})

	test('should return a formated results', () => {
		const result = getDetailedExpensesPerMonth(expensesRawDataForGetDetailedExpendesPerMonth)

		expect(Array.isArray(result)).toBe(true)
		expect(result).toEqual(expectedDataForGetDetailedExpendesPerMonth)
	})
})

describe('getDetailedExpensesGroupedFromRange', () => {
	test('should return null if no receive params', () => {
		const result = getDetailedExpensesGroupedFromRange()

		expect(result).toBeNull()
	})

	test('should return an empty array if receive an empty array', () => {
		const result = getDetailedExpensesGroupedFromRange([], '2021-01-01', '2021-07-31')

		expect(result).toBeNull()
	})

	test('should return a formatted results', () => {
		const result = getDetailedExpensesGroupedFromRange(expensesRawDataForGetDetailedExpensesGroupedFromRange, '2021-01-01', '2022-01-01')

		expect(result).toEqual(expectedDataForGetDetailedExpensesGroupedFromRange)
	})

	test('should return a formatted results with a simplified group title if initial date and end date is the same', () => {
		const result = getDetailedExpensesGroupedFromRange(expensesRawDataForGetDetailedExpensesGroupedFromRange, '2021-01-01', '2021-01-01')

		expect(result).toEqual(expectedDataForGetDetailedExpensesGroupedFromRangeOnCurrentMonth)
	})
})

describe('reading spending dates as calendar days', () => {
	const storedAtNoonUTC = (day) => String(Date.parse(`${day}T12:00:00.000Z`))

	const spendings = [
		{ category: 'category-id-1', subcategory: null, quantity: 10, date: storedAtNoonUTC('2026-02-28'), currencyISO: 'EUR', uuid: 'uuid-1' },
		{ category: 'category-id-1', subcategory: null, quantity: 5, date: storedAtNoonUTC('2026-03-01'), currencyISO: 'EUR', uuid: 'uuid-2' }
	]

	const groupTotals = (groups) => groups.map(({ groupTitle, groupTotal }) => ({ groupTitle, groupTotal }))

	describe.each(['Europe/Madrid', 'America/New_York', 'Pacific/Kiritimati'])('with the device in %s', (timeZone) => {
		beforeEach(() => {
			vi.stubEnv('TZ', timeZone)
		})

		afterEach(() => {
			vi.unstubAllEnvs()
		})

		test('should group a spending on the 1st in its own month', () => {
			expect(groupTotals(getDetailedExpensesPerMonth(spendings))).toEqual([
				{ groupTitle: 'February 2026', groupTotal: 10 },
				{ groupTitle: 'March 2026', groupTotal: 5 }
			])
		})

		test('should label the month of a day on the 1st', () => {
			expect(getSumPerMonth([{ date: '2026-03-01', quantity: 5 }])).toEqual([{ label: 'March 2026', sum: 5 }])
		})

		test('should title a range of one month with that month', () => {
			expect(getDetailedExpensesGroupedFromRange(spendings, '2026-03-01', '2026-03-31').groupTitle).toBe('March 2026')
		})

		test('should title a range of twelve months with its first and last months', () => {
			expect(getDetailedExpensesGroupedFromRange(spendings, '2025-10-01', '2026-09-30').groupTitle).toBe('Oct 2025 – Sep 2026')
		})
	})
})
