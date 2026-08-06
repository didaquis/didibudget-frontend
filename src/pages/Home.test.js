import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { MockedProvider } from '@apollo/client/testing'
import { InMemoryCache } from '@apollo/client'

import Home from './Home'
import { AuthContext } from '../AuthContext'

const renderHome = (isAuth) => render(
	<MockedProvider mocks={[]} cache={new InMemoryCache()}>
		<AuthContext.Provider value={{ isAuth, userData: {}, activateAuth: vi.fn(), removeAuth: vi.fn() }}>
			<MemoryRouter>
				<Home />
			</MemoryRouter>
		</AuthContext.Provider>
	</MockedProvider>
)

describe('Home', () => {
	it('greets a visitor without a session with the hero', () => {
		renderHome(false)

		expect(screen.getByRole('heading', { name: 'didibudget' })).toBeVisible()
		expect(screen.queryByRole('heading', { name: 'Dashboard' })).not.toBeInTheDocument()
	})

	it('shows the dashboard to a user with a session', () => {
		renderHome(true)

		expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
		expect(screen.queryByRole('heading', { name: 'didibudget' })).not.toBeInTheDocument()
	})
})
