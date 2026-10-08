import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { MockedProvider } from '@apollo/client/testing'

import { RecurringExpenseSuggestion } from './'

const suggestion = {
	uuid: 'suggestion-uuid',
	suggestedExpense: {
		category: 'home-id',
		categoryName: 'Home',
		categoryEmojis: ['🏠'],
		subcategory: 'mortgage-id',
		subcategoryName: 'Mortgage',
		subcategoryEmojis: [],
		quantity: 40
	}
}

const renderSuggestion = () => render(
	<MockedProvider mocks={[]}>
		<MemoryRouter>
			<ul>
				<RecurringExpenseSuggestion suggestion={suggestion} />
			</ul>
		</MemoryRouter>
	</MockedProvider>
)

describe('RecurringExpenseSuggestion', () => {
	it('shows what is suggested and how much it costs', () => {
		renderSuggestion()

		expect(screen.getByRole('listitem')).toHaveTextContent('Home - Mortgage')
		expect(screen.getByRole('listitem')).toHaveTextContent('40 €')
	})

	it('names the spending its save button would log', () => {
		renderSuggestion()

		expect(screen.getByRole('button', { name: 'Save Home - Mortgage, 40\u00a0€' })).toBeVisible()
	})
})
