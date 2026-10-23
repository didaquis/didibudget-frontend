import { render, screen } from '@testing-library/react'

import { RecurringExpenseSuggestionsOverview } from './'

describe('RecurringExpenseSuggestionsOverview', () => {
	it('shows nothing on a day without suggestions', () => {
		render(<RecurringExpenseSuggestionsOverview suggestions={[]} />)

		expect(screen.queryByRole('heading', { name: 'Due around this date' })).not.toBeInTheDocument()
		expect(screen.queryByRole('status')).not.toBeInTheDocument()
	})
})
