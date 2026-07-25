import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/client/testing'
import { InMemoryCache } from '@apollo/client'

import { LOGIN } from '../../gql/mutations/auth'
import { LoginForm } from './'

const customCache = new InMemoryCache()

describe('LoginForm', () => {
	it('should render a disabled button until password and email inputs are filled with data', async () => {
		const user = userEvent.setup()
		const activateAuth = vi.fn()
		const mocks = []

		render(
			<MockedProvider mocks={mocks} cache={customCache}>
				<LoginForm activateAuth={activateAuth} />
			</MockedProvider>
		)
		const emailInput = screen.getByRole('textbox', { name: /Email/i })
		const passwordInput = screen.getByPlaceholderText(/password/)
		const submitButton = screen.getByRole('button', { name: 'Log in' })

		expect(emailInput.value).toBe('')
		expect(passwordInput.value).toBe('')
		expect(submitButton).toBeDisabled()

		await user.type(emailInput, 'example@mail.com')
		expect(submitButton).toBeDisabled()

		await user.type(passwordInput, 'ABCabc*1234*4321')
		expect(submitButton).not.toBeDisabled()

		await user.clear(emailInput)
		await user.clear(passwordInput)
		expect(submitButton).toBeDisabled()
	})

	it('should call to activateAuth method passing a token as argument if credentials are valid', async () => {
		const user = userEvent.setup()
		const activateAuth = vi.fn()
		const mocks = [
			{
				request: {
					query: LOGIN,
					variables: {
						email: 'example@mail.com',
						password: 'ABCabc*1234*4321',
					},
				},
				result: {
					data: {
						authUser: {
							token: 'f3b2c1a0d2'
						}
					},
				},
			},
		]

		render(
			<MockedProvider mocks={mocks} cache={customCache}>
				<LoginForm activateAuth={activateAuth} />
			</MockedProvider>
		)

		const emailInput = screen.getByRole('textbox', { name: /Email/i })
		const passwordInput = screen.getByPlaceholderText(/password/)
		const submitButton = screen.getByRole('button', { name: 'Log in' })

		await user.type(emailInput, 'example@mail.com')
		await user.type(passwordInput, 'ABCabc*1234*4321')
		await user.click(submitButton)

		const submitButtonLoadingState = screen.getByRole('button', { name: 'Loading' })

		expect(submitButtonLoadingState).toBeVisible()
		expect(submitButtonLoadingState).toBeDisabled()

		await waitFor(() => expect(activateAuth).toHaveBeenCalled())
		expect(activateAuth).toHaveBeenCalledWith('f3b2c1a0d2')
	})

	it('should render an error if credentials are not valid', async () => {
		const user = userEvent.setup()
		const activateAuth = vi.fn()
		const mocks = [
			{
				request: {
					query: LOGIN,
					variables: {
						email: 'example@mail.com',
						password: 'ABCabc*1234*4321',
					},
				},
				result: {
					errors: [new Error('Invalid credentials')],
				},
			},
		]

		render(
			<MockedProvider mocks={mocks} cache={customCache}>
				<LoginForm activateAuth={activateAuth} />
			</MockedProvider>
		)

		const emailInput = screen.getByRole('textbox', { name: /Email/i })
		const passwordInput = screen.getByPlaceholderText(/password/)
		const submitButton = screen.getByRole('button', { name: 'Log in' })

		await user.type(emailInput, 'example@mail.com')
		await user.type(passwordInput, 'ABCabc*1234*4321')
		await user.click(submitButton)

		await waitFor(() => expect(activateAuth).not.toHaveBeenCalled())

		const submitButtonAfterCTA = await screen.findByRole('button', { name: 'Log in' })

		expect(submitButtonAfterCTA).toBeVisible()
		expect(submitButtonAfterCTA).not.toBeDisabled()

		expect(screen.getByRole('alert')).toBeVisible()
		expect(screen.getByText('Invalid credentials'))
	})
})