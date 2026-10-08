/**
 * Get the symbol of a currency from its ISO 4217 code (e.g., 'EUR' -> '€').
 * @param {string} [currencyISO='EUR'] - An ISO 4217 currency code.
 * @returns {string} The currency symbol, or the code itself when it has no known symbol.
 */
const currencySymbol = (currencyISO = 'EUR') => {
	try {
		const parts = new Intl.NumberFormat('en', { style: 'currency', currency: currencyISO }).formatToParts(0)

		return parts.find(part => part.type === 'currency')?.value ?? currencyISO
	} catch {
		return currencyISO
	}
}

/**
 * Join an amount and its currency symbol with a non-breaking space (e.g., 12.5, 'EUR' -> '12.5 €').
 * @param {number|string} amount - The amount, already formatted as it must be shown.
 * @param {string} [currencyISO='EUR'] - An ISO 4217 currency code.
 * @returns {string} The amount followed by the currency symbol.
 */
const formatAmount = (amount, currencyISO = 'EUR') => `${amount}\u00a0${currencySymbol(currencyISO)}`

export { currencySymbol, formatAmount }
