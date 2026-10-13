import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'

import { RequireAuth } from './index'
import { AuthContext } from '../../AuthContext'

const renderGuardedRoute = (isAuth) => {
	return render(
		<AuthContext.Provider value={{ isAuth }}>
			<MemoryRouter initialEntries={['/spending/add']}>
				<Routes>
					<Route path='/spending/add' element={
						<RequireAuth>
							<p>Protected screen</p>
						</RequireAuth>
					} />
					<Route path='/' element={<p>Home screen</p>} />
				</Routes>
			</MemoryRouter>
		</AuthContext.Provider>
	)
}

describe('RequireAuth', () => {
	it('renders the guarded screen when the user is authenticated', () => {
		renderGuardedRoute(true)

		expect(screen.getByText('Protected screen')).toBeVisible()
	})

	it('does not render the guarded screen when the user is not authenticated', () => {
		renderGuardedRoute(false)

		expect(screen.queryByText('Protected screen')).not.toBeInTheDocument()
	})

	it('sends the user to the home screen, where they can log in', () => {
		renderGuardedRoute(false)

		expect(screen.getByText('Home screen')).toBeVisible()
	})
})
