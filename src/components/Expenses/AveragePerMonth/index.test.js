import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { vi, describe, it, expect, beforeEach } from 'vitest'

import { AuthContext } from '../../../AuthContext'
import { AveragePerMonth } from './'

const mockUserData = {
	email: 'test@example.com',
	isAdmin: false,
	isActive: true,
	registrationDate: '2024-01-15',
	uuid: '12345'
}

const mockAverageData = {
	lastThreeMonthsAverage: { average: 150.50, currencyISO: 'EUR' },
	lastSixMonthsAverage: { average: 140.25, currencyISO: 'EUR' },
	lastTwelveMonthsAverage: { average: 130.00, currencyISO: 'EUR' },
	lastTwentyFourMonthsAverage: { average: 120.75, currencyISO: 'EUR' }
}

const mockMonthsBetweenDates = vi.fn()

vi.mock('../../../AuthContext', () => {
	const React = require('react')
	return {
		AuthContext: React.createContext()
	}
})

vi.mock('../utils', () => ({
	monthsBetweenDates: (...args) => mockMonthsBetweenDates(...args)
}))

describe('AveragePerMonth', () => {
	beforeEach(() => {
		mockMonthsBetweenDates.mockReset()
	})

	it('should return null when user has been registered for less than 4 months', () => {
		mockMonthsBetweenDates.mockReturnValue(3)

		const { container } = render(
			<AuthContext.Provider value={{ userData: mockUserData }}>
				<AveragePerMonth averageData={mockAverageData} title="Average Spending" />
			</AuthContext.Provider>
		)

		expect(container.firstChild).toBeNull()
	})

	it('should render table with 3-month average when user has been registered for 4+ months', () => {
		mockMonthsBetweenDates.mockReturnValue(4)

		render(
			<AuthContext.Provider value={{ userData: mockUserData }}>
				<AveragePerMonth averageData={mockAverageData} title="Average Spending" />
			</AuthContext.Provider>
		)

		expect(screen.getByRole('heading', { name: 'Average Spending' })).toBeVisible()
		expect(screen.getByText('Period (months)')).toBeVisible()
		expect(screen.getByText('Average monthly spending')).toBeVisible()
		expect(screen.getByRole('cell', { name: /3/ })).toBeVisible()
		expect(screen.getByText(/150/)).toBeVisible()
	})

	it('should not render 6-month average row when user has been registered for less than 7 months', () => {
		mockMonthsBetweenDates.mockReturnValue(6)

		const { rerender } = render(
			<AuthContext.Provider value={{ userData: mockUserData }}>
				<AveragePerMonth averageData={mockAverageData} title="Average Spending" />
			</AuthContext.Provider>
		)

		mockMonthsBetweenDates.mockReturnValue(6)
		rerender(
			<AuthContext.Provider value={{ userData: mockUserData }}>
				<AveragePerMonth averageData={mockAverageData} title="Average Spending" />
			</AuthContext.Provider>
		)

		expect(screen.queryByRole('cell', { name: /6/ })).toBeNull()
	})

	it('should not render 12-month average row when user has been registered for less than 13 months', () => {
		mockMonthsBetweenDates.mockReturnValue(12)

		const { rerender } = render(
			<AuthContext.Provider value={{ userData: mockUserData }}>
				<AveragePerMonth averageData={mockAverageData} title="Average Spending" />
			</AuthContext.Provider>
		)

		mockMonthsBetweenDates.mockReturnValue(12)
		rerender(
			<AuthContext.Provider value={{ userData: mockUserData }}>
				<AveragePerMonth averageData={mockAverageData} title="Average Spending" />
			</AuthContext.Provider>
		)

		expect(screen.queryByRole('cell', { name: /12/ })).toBeNull()
	})

	it('should not render 24-month average row when user has been registered for less than 25 months', () => {
		mockMonthsBetweenDates.mockReturnValue(24)

		const { rerender } = render(
			<AuthContext.Provider value={{ userData: mockUserData }}>
				<AveragePerMonth averageData={mockAverageData} title="Average Spending" />
			</AuthContext.Provider>
		)

		mockMonthsBetweenDates.mockReturnValue(24)
		rerender(
			<AuthContext.Provider value={{ userData: mockUserData }}>
				<AveragePerMonth averageData={mockAverageData} title="Average Spending" />
			</AuthContext.Provider>
		)

		expect(screen.queryByRole('cell', { name: /24/ })).toBeNull()
	})

	it('should render the section title', () => {
		mockMonthsBetweenDates.mockReturnValue(4)

		render(
			<AuthContext.Provider value={{ userData: mockUserData }}>
				<AveragePerMonth averageData={mockAverageData} title="My Custom Title" />
			</AuthContext.Provider>
		)

		expect(screen.getByRole('heading', { name: 'My Custom Title' })).toBeVisible()
	})

	it('should render correct average values in the table', () => {
		mockMonthsBetweenDates.mockReturnValue(4)

		render(
			<AuthContext.Provider value={{ userData: mockUserData }}>
				<AveragePerMonth averageData={mockAverageData} title="Average Spending" />
			</AuthContext.Provider>
		)

		expect(screen.getByText(/150/)).toBeVisible()
	})
})