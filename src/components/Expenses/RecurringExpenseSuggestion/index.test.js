import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { MockedProvider } from '@apollo/client/testing'

import { RecurringExpenseSuggestion } from './'
import { REGISTER_EXPENSE } from '../../../gql/mutations/expenses'

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

const renderSuggestion = (mocks = []) => {
	return render(
		<MockedProvider mocks={mocks}>
			<MemoryRouter>
				<ul>
					<RecurringExpenseSuggestion suggestion={suggestion} />
				</ul>
			</MemoryRouter>
		</MockedProvider>
	)
}

describe('RecurringExpenseSuggestion', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it('shows what is suggested and how much it costs', () => {
		renderSuggestion()

		expect(screen.getByRole('listitem')).toHaveTextContent('Home › Mortgage')
		expect(screen.getByRole('listitem')).toHaveTextContent('40 €')
	})

	it('names the spending its save button would log', () => {
		renderSuggestion()

		expect(screen.getByRole('button', { name: 'Save Home › Mortgage, 40\u00a0€' })).toBeVisible()
	})

	it('logs the spending on today on the device calendar', async () => {
		vi.useFakeTimers({ toFake: ['Date'] })
		// 00:30 on 1 March in Madrid, still 28 February in UTC
		vi.setSystemTime(new Date('2026-02-28T23:30:00.000Z'))
		const user = userEvent.setup()
		const result = vi.fn(() => ({
			data: { registerExpense: { quantity: 40, date: String(Date.parse('2026-03-01T12:00:00.000Z')), currencyISO: 'EUR', uuid: 'expense-uuid' } }
		}))
		renderSuggestion([{
			request: {
				query: REGISTER_EXPENSE,
				variables: { category: 'home-id', subcategory: 'mortgage-id', quantity: 40, date: '2026-03-01' }
			},
			result
		}])

		await user.click(screen.getByRole('button', { name: 'Save Home › Mortgage, 40\u00a0€' }))

		await waitFor(() => expect(result).toHaveBeenCalledTimes(1))
	})
})
