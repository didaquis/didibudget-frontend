import { render, screen, within } from '@testing-library/react'
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

		expect(within(screen.getByRole('table')).getByRole('button', { name: 'Delete January 2026, 1234.5\u00a0€' })).toBeVisible()
	})

	// The desktop table and the phone list are both rendered, and Bootstrap
	// hides one of them; jsdom loads no CSS, so both are in the tree here
	it('shows each balance in the phone list with its month and a delete button', () => {
		renderList()

		const item = within(screen.getByRole('listitem'))

		expect(item.getByText('January 2026')).toBeVisible()
		expect(item.getByText('1234.5 €')).toBeVisible()
		expect(item.getByRole('button', { name: 'Delete January 2026, 1234.5\u00a0€' })).toBeVisible()
	})
})
