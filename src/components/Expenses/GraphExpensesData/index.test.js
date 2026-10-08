import { cloneElement } from 'react'
import { render, screen } from '@testing-library/react'

import { GraphExpensesData } from '.'
import { AuthContext } from '../../../AuthContext'

// jsdom has no layout, so the real container measures 0×0 and draws nothing
vi.mock('recharts', async (importOriginal) => ({
	...await importOriginal(),
	ResponsiveContainer: ({ children }) => cloneElement(children, { width: 400, height: 300 })
}))

const average = { average: 100, currencyISO: 'EUR' }
const averageData = {
	lastThreeMonthsAverage: average,
	lastSixMonthsAverage: average,
	lastTwelveMonthsAverage: average,
	lastTwentyFourMonthsAverage: average
}

// 25 months, so the last-24-months chart shows too
const graphData = Array.from({ length: 25 }, (_, i) => ({ date: `${new Date(2024, i, 15).getTime()}`, quantity: 40 }))

const renderGraph = () => render(<GraphExpensesData graphData={graphData} averageData={averageData} averageDataExcludingSavings={averageData} />, {
	wrapper: ({ children }) => <AuthContext.Provider value={{ userData: { registrationDate: '2020-01-01T00:00:00.000Z' } }}>{children}</AuthContext.Provider>
})

describe('GraphExpensesData', () => {
	it('names each chart as an image of what it plots', () => {
		renderGraph()

		expect(screen.getByRole('img', { name: 'Bar chart of spending per month since January 2024' })).toBeVisible()
		expect(screen.getByRole('img', { name: 'Bar chart of spending per month over the last 24 months' })).toBeVisible()
	})

	it('keeps the charts out of the tab order', () => {
		renderGraph()

		screen.getAllByRole('img').forEach(chart => expect(chart).not.toHaveAttribute('tabindex'))
	})
})
