import { parseDataForGraph, getLastMonthsData, computeDifferential, formatEuro } from './index'
import { rawData, allDataParsed, allDataParsedFewMonths, allDataParsedEnoughtMonths, allDataParsedLotOfMonths, lastYearDataParsed } from './fixtures'

describe('parseDataForGraph', () => {
	test('should return an empty array if receive an empty array', () => {
		const data = []
		const result = parseDataForGraph(data)
	 	expect(result).toEqual([])
	})

	test('should returns an array of valid data for the graph. Refill the empty data of every month (without balance) and do an average of repeated months. It must respect the balance with value 0', () => {
		const result = parseDataForGraph(rawData)
	 	expect(result).toEqual(allDataParsed)
	})
})

describe('getLastMonthsData', () => {
	test('should return an empty array if receive an empty array or nothing', () => {
		const result = getLastMonthsData([])
		const anotherResult = getLastMonthsData()
	 	expect(result).toEqual([])
	 	expect(anotherResult).toEqual([])
	})

	test('should return an empty array if receive an array with length minor than 12', () => {
		const result = getLastMonthsData(allDataParsedFewMonths)
	 	expect(result).toEqual([])
	})

	test('should return the same array if receive a valid array with length equal of 12', () => {
		const result = getLastMonthsData(allDataParsedEnoughtMonths)
		expect(result).toEqual(lastYearDataParsed)
		expect(result.length).toEqual(12)
	})

	test('should returns an array with length of 12 if receive an array of valid data with a length of more than 12 months', () => {
		const result = getLastMonthsData(allDataParsedLotOfMonths)
	 	expect(result).toEqual(lastYearDataParsed)
	 	expect(result.length).toEqual(12)
	})

	test('should return an empty array if the are not enough data', () => {
		const months = 24
		const result = getLastMonthsData(allDataParsedEnoughtMonths, months)
		expect(result).toEqual([])
	})

	test('should an array with length of 12 if there are enough data', () => {
		const months = 6
		const result = getLastMonthsData(allDataParsedEnoughtMonths, months)
		expect(result.length).toEqual(6)
	})
})

describe('computeDifferential', () => {
	test('should return null for empty array', () => {
		expect(computeDifferential([])).toBeNull()
	})

	test('should return null for array with single entry', () => {
		expect(computeDifferential([{ date: '2015-01-01', balance: 100 }])).toBeNull()
	})

	test('should compute positive differential (last - first)', () => {
		const data = [
			{ date: '2015-01-01', balance: 100 },
			{ date: '2015-02-01', balance: 200 },
			{ date: '2015-03-01', balance: 350 },
		]
		expect(computeDifferential(data)).toBe(250)
	})

	test('should compute negative differential', () => {
		const data = [
			{ date: '2015-01-01', balance: 500 },
			{ date: '2015-02-01', balance: 300 },
			{ date: '2015-03-01', balance: 200 },
		]
		expect(computeDifferential(data)).toBe(-300)
	})

	test('should skip entries without balance property', () => {
		const data = [
			{ date: '2015-01-01' },
			{ date: '2015-02-01', balance: 100 },
			{ date: '2015-03-01', balance: 500 },
		]
		expect(computeDifferential(data)).toBe(400)
	})

	test('should return null if fewer than 2 entries with balance', () => {
		const data = [
			{ date: '2015-01-01' },
			{ date: '2015-02-01', balance: 100 },
			{ date: '2015-03-01' },
		]
		expect(computeDifferential(data)).toBeNull()
	})

	test('should return null if no entries have balance', () => {
		const data = [
			{ date: '2015-01-01' },
			{ date: '2015-02-01' },
		]
		expect(computeDifferential(data)).toBeNull()
	})

	test('should return zero differential when first and last balance are equal', () => {
		const data = [
			{ date: '2015-01-01', balance: 300 },
			{ date: '2015-02-01', balance: 150 },
			{ date: '2015-03-01', balance: 300 },
		]
		expect(computeDifferential(data)).toBe(0)
	})

	test('should return value rounded to 2 decimal places', () => {
		const data = [
			{ date: '2015-01-01', balance: 100.1234 },
			{ date: '2015-02-01', balance: 200.4567 },
			{ date: '2015-03-01', balance: 350.789 },
		]
		expect(computeDifferential(data)).toBeCloseTo(250.67, 2)
	})

	test('should work with real parsed data shape', () => {
		const data = [
			{ date: '2014-11-01', balance: 0 },
			{ date: '2014-12-01', balance: 678.74 },
			{ date: '2015-01-01', balance: 995.32 },
			{ date: '2015-02-01' },
			{ date: '2015-03-01', balance: 8110.37 },
		]
		expect(computeDifferential(data)).toBe(8110.37)
	})
})

describe('formatEuro', () => {
	test('should format positive number', () => {
		expect(formatEuro(3140.26)).toBe('+ 3140.26 €')
	})

	test('should format negative number', () => {
		expect(formatEuro(-1200.50)).toBe('- 1200.50 €')
	})

	test('should format zero', () => {
		expect(formatEuro(0)).toBe('0.00 €')
	})

	test('should format null as zero', () => {
		expect(formatEuro(null)).toBe('0.00 €')
	})

	test('should format undefined as zero', () => {
		expect(formatEuro(undefined)).toBe('0.00 €')
	})

	test('should format large number without thousands separators', () => {
		expect(formatEuro(1234567.89)).toBe('+ 1234567.89 €')
	})

	test('should format integer with two decimals', () => {
		expect(formatEuro(1000)).toBe('+ 1000.00 €')
	})

	test('should format small decimal', () => {
		expect(formatEuro(0.5)).toBe('+ 0.50 €')
	})

	test('should format negative small decimal', () => {
		expect(formatEuro(-0.5)).toBe('- 0.50 €')
	})
})