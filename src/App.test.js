import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { MockedProvider } from '@apollo/client/testing'
import { InMemoryCache } from '@apollo/client'

import { App } from './App'
import { AuthContext } from './AuthContext'

const renderAppAt = (path, authValue = { isAuth: false, userData: {}, activateAuth: vi.fn(), removeAuth: vi.fn() }) => {
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

// '/' is deliberately absent: the two tests above already pin it, and by the time this table runs
// Home is resolved, so the row would pass on Home's own data-loading Spinner instead of the boundary.
const LAZY_ROUTE_PATHS = [
	'/monthly-balance/add',
	'/monthly-balance/overview',
	'/monthly-balance/list',
	'/savings-and-investments',
	'/spending/add',
	'/spending/overview',
	'/spending/list',
	'/spending/monthly-breakdown',
	'/spending/monthly',
	'/spending/yearly',
	'/spending/search',
	'/users'
]

describe('App routing', () => {
	it('shows the not found screen for an unknown url', () => {
		renderAppAt('/this-route-does-not-exist')

		expect(screen.getByRole('heading', { name: 'Page not found' })).toBeVisible()
		expect(screen.getByRole('link', { name: 'Go to the home page' })).toBeVisible()
	})

	it('shows the login screen to a visitor without a session', () => {
		renderAppAt('/login')

		expect(screen.getByRole('button', { name: 'Log in' })).toBeVisible()
	})

	it('sends a visitor without a session away from a protected screen', () => {
		renderAppAt('/spending/add')

		expect(screen.getByRole('button', { name: 'Log in' })).toBeVisible()
	})

	// Must run before any other test renders '/': React.lazy resolves its import once and never
	// suspends again, so a later run of this test would find Home already loaded.
	it('shows the spinner while navigating from a screen without a lazy boundary to one with one', async () => {
		const user = userEvent.setup()
		renderAppAt('/login')

		await user.click(screen.getByRole('link', { name: 'Home' }))

		expect(await screen.findByText('Loading...')).toBeVisible()
	})

	it('shows the spinner while a lazy screen is loading', async () => {
		renderAppAt('/')

		expect(screen.getByText('Loading...')).toBeVisible()

		expect(await screen.findByRole('heading', { name: 'didibudget' })).toBeVisible()
	})

	describe('browser tab title', () => {
		it('names the tab after the current screen', () => {
			renderAppAt('/register')

			expect(document.title).toBe('Create an account | didibudget')
		})

		it('drops the previous screen name when a visitor returns to the landing screen', async () => {
			const user = userEvent.setup()
			renderAppAt('/register')

			await user.click(screen.getByRole('link', { name: 'Home' }))
			await screen.findByRole('heading', { name: 'didibudget' })

			expect(document.title).toBe('didibudget')
		})
	})

	describe.each(LAZY_ROUTE_PATHS)('lazy route %s', (path) => {
		it('shows the spinner while the screen is loading', () => {
			renderAppAt(path, { isAuth: true, userData: { isAdmin: true } })

			expect(screen.getByText('Loading...')).toBeVisible()
		})
	})
})
