import { render, screen } from '@testing-library/react'

import { RecurringExpenseSuggestionsOverview } from './'

describe('RecurringExpenseSuggestionsOverview', () => {
	it('shows nothing on a day without suggestions', () => {
		render(<RecurringExpenseSuggestionsOverview suggestions={[]} />)

		expect(screen.queryByRole('heading', { name: 'Recurring spending' })).not.toBeInTheDocument()
		expect(screen.queryByRole('status')).not.toBeInTheDocument()
	})
})
