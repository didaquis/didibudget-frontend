import { render, screen } from '@testing-library/react'

import { RecurringExpenseSuggestionsOverview } from './'

describe('RecurringExpenseSuggestionsOverview', () => {
	it('announces politely that there is nothing to suggest', () => {
		render(<RecurringExpenseSuggestionsOverview suggestions={[]} />)

		expect(screen.getByRole('status')).toHaveTextContent('No suggestions available right now.')
		expect(screen.queryByRole('alert')).not.toBeInTheDocument()
	})
})
