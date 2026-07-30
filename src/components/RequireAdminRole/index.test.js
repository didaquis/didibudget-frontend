import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'

import { RequireAdminRole } from './index'
import { AuthContext } from '../../AuthContext'

const renderGuardedRoute = (userData) => {
	return render(
		<AuthContext.Provider value={{ userData }}>
			<MemoryRouter initialEntries={['/users']}>
				<Routes>
					<Route path='/users' element={
						<RequireAdminRole>
							<p>User administration screen</p>
						</RequireAdminRole>
					} />
					<Route path='/' element={<p>Home screen</p>} />
				</Routes>
			</MemoryRouter>
		</AuthContext.Provider>
	)
}

describe('RequireAdminRole', () => {
	it('renders the guarded screen for an administrator', () => {
		renderGuardedRoute({ isAdmin: true })

		expect(screen.getByText('User administration screen')).toBeVisible()
	})

	it('redirects to the home screen for a non administrator', () => {
		renderGuardedRoute({ isAdmin: false })

		expect(screen.getByText('Home screen')).toBeVisible()
	})

	it('redirects to the home screen when the role is unknown', () => {
		renderGuardedRoute({})

		expect(screen.getByText('Home screen')).toBeVisible()
	})
})
