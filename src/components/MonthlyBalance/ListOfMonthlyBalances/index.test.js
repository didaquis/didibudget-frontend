import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import { ListOfMonthlyBalances } from './index'

const monthlyBalances = [
	{ balance: 1234.5, year: 2026, month: 'JANUARY', currencyISO: 'EUR', uuid: 'monthly-balance-uuid-1' }
]

const renderList = () => {
	render(
		<MockedProvider mocks={[]}>
			<ListOfMonthlyBalances
				monthlyBalances={monthlyBalances}
				paginationData={{ currentPage: 1, totalPages: 1 }}
				refetch={vi.fn()}
				onChangePage={vi.fn()}
			/>
		</MockedProvider>
	)
}

describe('ListOfMonthlyBalances', () => {
	it('labels the first column as the month', () => {
		renderList()

		expect(screen.getByRole('columnheader', { name: 'Month' })).toBeVisible()
	})

	it('shows each balance under its month name and year', () => {
		renderList()

		expect(screen.getByRole('cell', { name: 'January 2026' })).toBeVisible()
	})

	it('names the delete button after the month and the amount', () => {
		renderList()

		expect(screen.getByRole('button', { name: 'Delete January 2026, 1234.5 EUR' })).toBeVisible()
	})
})
