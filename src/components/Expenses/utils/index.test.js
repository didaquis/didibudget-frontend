import { getNameOfCategoryOrSubcategory, getSumPerMonth, getDetailedExpendesPerMonth, getAveragePerMonth, averageOfLast } from './index'

import { expensesRawData, expectedData, expensesRawDataForGetDetailedExpendesPerMonth, expectedDataForGetDetailedExpendesPerMonth, expectedAverageData } from './fixtures'


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

describe('getDetailedExpendesPerMonth', () => {
	test('should return an empty array if no receive params', () => {
		const result = getDetailedExpendesPerMonth()

		expect(Array.isArray(result)).toBe(true)
		expect(result).toEqual([])
	})

	test('should return an empty array receive an empty array', () => {
		const result = getDetailedExpendesPerMonth([])

		expect(Array.isArray(result)).toBe(true)
		expect(result).toEqual([])
	})

	test('should return a formated results', () => {
		const result = getDetailedExpendesPerMonth(expensesRawDataForGetDetailedExpendesPerMonth)

		expect(Array.isArray(result)).toBe(true)
		expect(result).toEqual(expectedDataForGetDetailedExpendesPerMonth)
	})
})

describe('getAveragePerMonth', () => {
	afterEach(() => {    
		jest.clearAllMocks()
	})

	test('should return an array', () => {
		expect(getAveragePerMonth()).toEqual([])
	})

	test('should return an array of numbers if receive an array of valid data with at least one object from a past month', () => {
		expect.hasAssertions()
		const result = getAveragePerMonth(expensesRawData)

		result.forEach(element => {
			expect(typeof element).toBe('number')
			expect(element).not.toBeNaN()
		})
	})

	test('should fill the gap from the last month until the second to last currently month', () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => 1619323711823)

		const result = getAveragePerMonth(expensesRawData)

		expect(result).toEqual(expectedAverageData)
	})

})

describe('averageOfLast', () => {
	test('should return null if there are not enought data', () => {
		expect(averageOfLast([], 6)).toBeNull()
		expect(averageOfLast([2, 45, 765.23, 0, 0], 6)).toBeNull()
	})

	test('should return a number if there are enought data', () => {
		expect(averageOfLast([0, 0, 0, 0, 0, 0], 6)).toBe(0)
		expect(averageOfLast([1, 1, 1, 1, 1, 1], 6)).toBe(1)
		expect(averageOfLast([2, 4, 2, 4, 2, 4], 6)).toBe(3)
	})

	test('should return the average of last 6 numbers', () => {
		expect(averageOfLast([999, 0, 888, 2, 4, 2, 4, 2, 4], 6)).toBe(3)
		expect(averageOfLast([88, 0, 0, 0, 0, 0, 0, 0,], 6)).toBe(0)
	})

	test('should return the average of last 3 numbers', () => {
		expect(averageOfLast([20, 4, 2, 4], 3)).toBe(3.33)
		expect(averageOfLast([77, 0, 0, 0,], 3)).toBe(0)
		expect(averageOfLast([20.01, 13.67, 0,], 3)).toBe(11.22)
	})
})