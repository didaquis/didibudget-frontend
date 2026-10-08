import { render, screen } from '@testing-library/react'
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
})
