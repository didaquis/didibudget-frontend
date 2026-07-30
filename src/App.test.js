import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { MockedProvider } from '@apollo/client/testing'
import { InMemoryCache } from '@apollo/client'

import { App } from './App'
import { AuthContext } from './AuthContext'

const renderAppAt = (path, authValue = { isAuth: false, userData: {} }) => {
	return render(
		<MockedProvider mocks={[]} cache={new InMemoryCache()}>
			<AuthContext.Provider value={authValue}>
				<MemoryRouter initialEntries={[path]}>
					<App />
				</MemoryRouter>
			</AuthContext.Provider>
		</MockedProvider>
	)
}

describe('App routing', () => {
	it('shows the not found screen for an unknown url', () => {
		renderAppAt('/this-route-does-not-exist')

		expect(screen.getByRole('alert')).toHaveTextContent('404')
	})

	it('shows the login screen to a visitor without a session', () => {
		renderAppAt('/login')

		expect(screen.getByRole('button', { name: 'Log in' })).toBeVisible()
	})

	it('sends a visitor without a session away from a protected screen', () => {
		renderAppAt('/add-expense')

		expect(screen.getByRole('button', { name: 'Log in' })).toBeVisible()
	})

	it('shows the spinner while a lazy screen is loading', () => {
		renderAppAt('/')

		expect(screen.getByText('Loading...')).toBeVisible()
	})
})
