import { currencySymbol, formatAmount } from './currency'

describe('currencySymbol', () => {
	test('should return the euro sign for EUR', () => {
		expect(currencySymbol('EUR')).toBe('€')
	})

	test('should default to the euro sign when no currency is given', () => {
		expect(currencySymbol()).toBe('€')
	})

	test('should return the symbol of other currencies', () => {
		expect(currencySymbol('USD')).toBe('$')
	})

	test('should fall back to the code when it is not a valid currency', () => {
		expect(currencySymbol('NOPE1')).toBe('NOPE1')
	})
})

describe('formatAmount', () => {
	test('should put the currency symbol after the amount', () => {
		expect(formatAmount('12.50', 'EUR')).toBe('12.50\u00a0€')
	})

	test('should default to euros when no currency is given', () => {
		expect(formatAmount(7)).toBe('7\u00a0€')
	})
})
