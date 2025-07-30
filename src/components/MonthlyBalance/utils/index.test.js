import { parseDataForGraph, getLastMonthsData } from './index'
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