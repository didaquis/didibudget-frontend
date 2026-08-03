import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'

import { RegisterMonthlyBalanceForm } from './index'
import { REGISTER_MONTHLY_BALANCE } from '../../../gql/mutations/monthlyBalances'

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth()
const currentMonthName = monthNames[currentMonth]

/* The component builds the date as the 1st of the selected month at 03:00 */
const firstOfCurrentMonth = new Date(currentYear, currentMonth, 1, 3)

const successfulMutation = {
	request: {
		query: REGISTER_MONTHLY_BALANCE,
		variables: { balance: 1234.99, date: firstOfCurrentMonth }
	},
	result: {
		data: {
			registerMonthlyBalance: {
				__typename: 'MonthlyBalance',
				balance: 1234.99,
				date: String(firstOfCurrentMonth.getTime()),
				currencyISO: 'EUR',
				uuid: 'monthly-balance-uuid-1'
			}
		}
	}
}

const failingMutation = {
	...successfulMutation,
	result: undefined,
	error: new Error('Something went wrong')
}

/* Chosen so both the year and the month differ from today's, on purpose */
const chosenYear = 2022
const chosenMonth = 'March'
const firstOfChosenMonth = new Date(chosenYear, monthNames.indexOf(chosenMonth), 1, 3)

const chosenMonthMutation = {
	request: {
		query: REGISTER_MONTHLY_BALANCE,
		variables: { balance: 1234.99, date: firstOfChosenMonth }
	},
	result: {
		data: {
			registerMonthlyBalance: {
				__typename: 'MonthlyBalance',
				balance: 1234.99,
				date: String(firstOfChosenMonth.getTime()),
				currencyISO: 'EUR',
				uuid: 'monthly-balance-uuid-2'
			}
		}
	}
}

/* No router on purpose: if the component ever calls useNavigate again, this render throws */
const renderForm = (mocks = [successfulMutation]) => {
	render(
		<MockedProvider mocks={mocks}>
			<RegisterMonthlyBalanceForm />
		</MockedProvider>
	)
}

describe('RegisterMonthlyBalanceForm', () => {
	it('reports the saved balance and month after a successful submission', async () => {
		const user = userEvent.setup()
		renderForm()

		await user.type(screen.getByLabelText(/Balance/), '1234.99')
		await user.click(screen.getByRole('button', { name: 'Save monthly balance' }))

		await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(new RegExp(`^✓ 1234\\.99 EUR · ${currentMonthName} ${currentYear}$`)))
	})

	it('reports the chosen month and year, not the current one, after a successful submission', async () => {
		const user = userEvent.setup()
		renderForm([chosenMonthMutation])

		await user.selectOptions(screen.getByLabelText(/Year/), String(chosenYear))
		await user.selectOptions(screen.getByLabelText(/Month/), chosenMonth)
		await user.type(screen.getByLabelText(/Balance/), '1234.99')
		await user.click(screen.getByRole('button', { name: 'Save monthly balance' }))

		await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(new RegExp(`^✓ 1234\\.99 EUR · ${chosenMonth} ${chosenYear}$`)))
	})

	it('clears the balance but keeps year and month after saving', async () => {
		const user = userEvent.setup()
		renderForm()

		await user.type(screen.getByLabelText(/Balance/), '1234.99')
		await user.click(screen.getByRole('button', { name: 'Save monthly balance' }))

		await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('1234.99 EUR'))

		expect(screen.getByLabelText(/Balance/)).toHaveValue(null)
		expect(screen.getByLabelText(/Year/)).toHaveDisplayValue(String(currentYear))
		expect(screen.getByLabelText(/Month/)).toHaveDisplayValue(currentMonthName)
		/* Disabled because the Balance field is now empty (invalid form), not because the submission is still in flight */
		expect(screen.getByRole('button', { name: 'Save monthly balance' })).toBeDisabled()
	})

	it('returns the focus to the balance field after saving', async () => {
		const user = userEvent.setup()
		renderForm()

		await user.type(screen.getByLabelText(/Balance/), '1234.99')
		await user.click(screen.getByRole('button', { name: 'Save monthly balance' }))

		await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('1234.99 EUR'))

		expect(screen.getByLabelText(/Balance/)).toHaveFocus()
	})

	it('keeps the value and shows the error without a toast when the mutation fails', async () => {
		const user = userEvent.setup()
		renderForm([failingMutation])

		await user.type(screen.getByLabelText(/Balance/), '1234.99')
		await user.click(screen.getByRole('button', { name: 'Save monthly balance' }))

		expect(await screen.findByRole('alert')).toBeVisible()
		expect(screen.getByRole('status')).toBeEmptyDOMElement()
		expect(screen.getByLabelText(/Balance/)).toHaveValue(1234.99)
		expect(screen.getByRole('button', { name: 'Save monthly balance' })).toBeEnabled()
	})
})
