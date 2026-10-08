import { render, screen, within } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import { ListOfExpenses } from './'

describe('ListOfExpenses', () => {
	it('should say no spending is recorded yet when there is none', () => {
		render(
			<MockedProvider mocks={[]}>
				<ListOfExpenses
					expenses={[]}
					paginationData={{ currentPage: 1, totalPages: 0 }}
					categories={[]}
					refetch={vi.fn()}
					onChangePage={vi.fn()}
				/>
			</MockedProvider>
		)

		expect(screen.getByRole('status')).toHaveTextContent('No spending recorded yet. Add your first spend to see the list.')
	})

	// The desktop table and the phone list are both rendered, and Bootstrap
	// hides one of them; jsdom loads no CSS, so both are in the tree here
	it('should show each spend in the phone list with its category, date and amount', () => {
		render(
			<MockedProvider mocks={[]}>
				<ListOfExpenses
					expenses={[{ uuid: 'spend-1', date: '1785664800000', category: 'home-id', subcategory: 'electricity-id', quantity: 27.34, currencyISO: 'EUR' }]}
					paginationData={{ currentPage: 1, totalPages: 1 }}
					categories={[{ _id: 'home-id', uuid: 'home-uuid', name: 'Home', subcategories: [{ _id: 'electricity-id', uuid: 'electricity-uuid', name: 'Electricity bill' }] }]}
					refetch={vi.fn()}
					onChangePage={vi.fn()}
				/>
			</MockedProvider>
		)

		const listItem = screen.getByRole('listitem')
		const item = within(listItem)

		expect(item.getByText('Home › Electricity bill')).toBeVisible()
		expect(listItem).toHaveTextContent('2026-08-02 · 27.34 €')
		expect(item.getByRole('button', { name: 'Delete 2026-08-02, Home › Electricity bill, 27.34 €' })).toBeVisible()
	})
})
