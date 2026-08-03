import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'

import { AddExpenseForm } from './index'
import { REGISTER_EXPENSE } from '../../../gql/mutations/expenses'
import { startOfDay } from '../../../utils/utils'

const categories = [
	{
		_id: 'category-id-2',
		name: 'Taxes',
		emojis: ['🏛'],
		uuid: 'category-uuid-2',
		subcategories: []
	}
]

const frequentCategories = [
	{
		category: 'category-id-2',
		categoryName: 'Taxes',
		categoryEmojis: ['🏛'],
		subcategory: null,
		subcategoryName: null,
		subcategoryEmojis: []
	}
]

const startOfToday = () => startOfDay(new Date())

const successfulMutation = {
	request: {
		query: REGISTER_EXPENSE,
		variables: {
			category: 'category-id-2',
			subcategory: null,
			quantity: 12.4,
			date: startOfToday()
		}
	},
	result: {
		data: {
			registerExpense: {
				__typename: 'Expense', quantity: 12.4,
				date: String(startOfToday().getTime()),
				currencyISO: 'EUR',
				uuid: 'expense-uuid-1'
			}
		}
	}
}

const failingMutation = {
	...successfulMutation,
	result: undefined,
	error: new Error('Something went wrong')
}

const renderForm = (mocks = [successfulMutation]) => {
	render(
		<MockedProvider mocks={mocks} >
			<AddExpenseForm categories={categories} frequentCategories={frequentCategories} />
		</MockedProvider>
	)
}

describe('AddExpenseForm', () => {
	it('keeps saving disabled until an amount and a category are given', async () => {
		const user = userEvent.setup()
		renderForm()

		expect(screen.getByRole('button', { name: 'Save expense' })).toBeDisabled()

		await user.type(screen.getByLabelText(/Amount/), '12.40')

		expect(screen.getByRole('button', { name: 'Save expense' })).toBeDisabled()

		await user.click(screen.getAllByRole('button', { name: /Taxes/ })[0])

		expect(screen.getByRole('button', { name: 'Save expense' })).toBeEnabled()
	})

	it('reports what was saved after a successful submission', async () => {
		const user = userEvent.setup()
		renderForm()

		await user.type(screen.getByLabelText(/Amount/), '12.40')
		await user.click(screen.getAllByRole('button', { name: /Taxes/ })[0])
		await user.click(screen.getByRole('button', { name: 'Save expense' }))

		await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^✓ 12\.40 EUR · Taxes$/))
	})

	it('clears the amount and the category after saving', async () => {
		const user = userEvent.setup()
		renderForm()

		await user.type(screen.getByLabelText(/Amount/), '12.40')
		await user.click(screen.getAllByRole('button', { name: /Taxes/ })[0])
		await user.click(screen.getByRole('button', { name: 'Save expense' }))

		await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('12.40 EUR · Taxes'))

		expect(screen.getByLabelText(/Amount/)).toHaveValue(null)
		expect(screen.getByLabelText('Filter categories')).toBeVisible()
		expect(screen.getByRole('button', { name: 'Save expense' })).toBeDisabled()
		expect(screen.getByLabelText(/Amount/)).toHaveFocus()
	})

	it('keeps the values and shows the error when the mutation fails', async () => {
		const user = userEvent.setup()
		renderForm([failingMutation])

		await user.type(screen.getByLabelText(/Amount/), '12.40')
		await user.click(screen.getAllByRole('button', { name: /Taxes/ })[0])
		await user.click(screen.getByRole('button', { name: 'Save expense' }))

		expect(await screen.findByRole('alert')).toBeVisible()
		expect(screen.getByLabelText(/Amount/)).toHaveValue(12.4)
		expect(screen.getByRole('button', { name: 'Change' })).toBeVisible()
		expect(screen.getByRole('button', { name: 'Save expense' })).toBeEnabled()
	})

	it('resets the date to today after saving', async () => {
		const user = userEvent.setup()
		const yesterday = startOfDay(new Date())
		yesterday.setDate(yesterday.getDate() - 1)

		const yesterdayMutation = {
			request: {
				query: REGISTER_EXPENSE,
				variables: {
					category: 'category-id-2',
					subcategory: null,
					quantity: 12.4,
					date: yesterday
				}
			},
			result: {
				data: {
					registerExpense: {
						quantity: 12.4,
						date: String(yesterday.getTime()),
						currencyISO: 'EUR',
						uuid: 'expense-uuid-1'
					}
				}
			}
		}

		renderForm([yesterdayMutation])

		await user.click(screen.getByRole('button', { name: 'Yesterday' }))
		await user.type(screen.getByLabelText(/Amount/), '12.40')
		await user.click(screen.getAllByRole('button', { name: /Taxes/ })[0])
		await user.click(screen.getByRole('button', { name: 'Save expense' }))

		await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('12.40 EUR · Taxes'))

		expect(screen.getByRole('button', { name: 'Today', pressed: true })).toBeVisible()
	})
})
