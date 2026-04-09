import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { ViewGetSavingsAndInvestments } from './'

describe('ViewGetSavingsAndInvestments', () => {
	const mockData = [
		{ categoryType: 'investment', sum: 5000, currencyISO: 'EUR' },
		{ categoryType: 'pension_plan', sum: 3000, currencyISO: 'EUR' },
		{ categoryType: 'investment', sum: 2000, currencyISO: 'EUR' }
	]

	test('renders table with data rows', () => {
		render(<ViewGetSavingsAndInvestments data={mockData} />)
		expect(screen.getAllByText('Portfolio investment')).toHaveLength(2)
		expect(screen.getByText('Pension plan')).toBeInTheDocument()
	})

	test('displays total in tfoot row', () => {
		render(<ViewGetSavingsAndInvestments data={mockData} />)
		const totalCell = screen.getByText('10000 EUR')
		expect(totalCell).toBeInTheDocument()
	})

	test('displays 0 total for empty data', () => {
		render(<ViewGetSavingsAndInvestments data={[]} />)
		const totalCells = screen.getAllByRole('row')
		const footerRow = totalCells[totalCells.length - 1]
		expect(footerRow).toHaveTextContent('Total')
		expect(footerRow).toHaveTextContent('0')
	})

	test('displays total only once in table footer', () => {
		render(<ViewGetSavingsAndInvestments data={mockData} />)
		const totalElements = screen.getAllByText('10000 EUR')
		expect(totalElements.length).toBe(1)
	})

	test('renders table header with correct columns', () => {
		render(<ViewGetSavingsAndInvestments data={mockData} />)
		expect(screen.getByText('Product')).toBeInTheDocument()
		expect(screen.getByText('Total invested')).toBeInTheDocument()
	})

	test('displays individual item amounts with currency', () => {
		render(<ViewGetSavingsAndInvestments data={mockData} />)
		expect(screen.getByText('5000 EUR')).toBeInTheDocument()
		expect(screen.getByText('3000 EUR')).toBeInTheDocument()
		expect(screen.getByText('2000 EUR')).toBeInTheDocument()
	})

	test('renders total label in footer', () => {
		render(<ViewGetSavingsAndInvestments data={mockData} />)
		const rows = screen.getAllByRole('row')
		const footerRow = rows[rows.length - 1]
		expect(footerRow).toHaveTextContent('Total')
	})
})
