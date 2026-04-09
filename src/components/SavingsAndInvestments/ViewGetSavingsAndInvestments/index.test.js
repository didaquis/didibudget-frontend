import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CategoryType } from '../utils/index'

import { ViewGetSavingsAndInvestments } from './'

describe('ViewGetSavingsAndInvestments', () => {
	const mockData = [
		{ categoryType: CategoryType.INVESTMENT, sum: 5000, currencyISO: 'EUR' },
		{ categoryType: CategoryType.PENSION_PLAN, sum: 3000, currencyISO: 'EUR' }
	]

	test('renders table with data rows', () => {
		render(<ViewGetSavingsAndInvestments data={mockData} />)
		expect(screen.getByText('Pension plan')).toBeVisible()
		expect(screen.getByText('Portfolio investment')).toBeVisible()
	})

	test('displays total in tfoot row', () => {
		render(<ViewGetSavingsAndInvestments data={mockData} />)
		const totalCell = screen.getByText('8000 EUR')
		expect(totalCell).toBeVisible()
	})

	test('does not display footer when total is 0', () => {
		render(<ViewGetSavingsAndInvestments data={[
			{ categoryType: CategoryType.INVESTMENT, sum: 0, currencyISO: 'EUR' },
			{ categoryType: CategoryType.PENSION_PLAN, sum: 0, currencyISO: 'EUR' }
		]} />)
		const rows = screen.getAllByRole('row')
		expect(rows.length).toBe(3)
		expect(screen.queryByText('Total')).not.toBeInTheDocument()
	})

	test('displays total only once in table footer', () => {
		render(<ViewGetSavingsAndInvestments data={mockData} />)
		const totalElements = screen.getAllByText('8000 EUR')
		expect(totalElements.length).toBe(1)
	})

	test('renders table header with correct columns', () => {
		render(<ViewGetSavingsAndInvestments data={mockData} />)
		expect(screen.getByText('Product')).toBeVisible()
		expect(screen.getByText('Total invested')).toBeVisible()
	})

	test('displays individual item amounts with currency', () => {
		render(<ViewGetSavingsAndInvestments data={mockData} />)
		expect(screen.getByText('5000 EUR')).toBeVisible()
		expect(screen.getByText('3000 EUR')).toBeVisible()
	})

	test('renders total label in footer', () => {
		render(<ViewGetSavingsAndInvestments data={mockData} />)
		const rows = screen.getAllByRole('row')
		const footerRow = rows[rows.length - 1]
		expect(footerRow).toHaveTextContent('Total')
	})
})
