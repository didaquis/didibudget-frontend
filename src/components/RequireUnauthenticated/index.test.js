import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'

import { RequireUnauthenticated } from './index'
import { AuthContext } from '../../AuthContext'

const renderGuardedRoute = (isAuth) => {
	return render(
		<AuthContext.Provider value={{ isAuth }}>
			<MemoryRouter initialEntries={['/login']}>
				<Routes>
					<Route path='/login' element={
						<RequireUnauthenticated>
							<p>Login screen</p>
						</RequireUnauthenticated>
					} />
					<Route path='/' element={<p>Home screen</p>} />
				</Routes>
			</MemoryRouter>
		</AuthContext.Provider>
	)
}

describe('RequireUnauthenticated', () => {
	it('renders the guarded screen when there is no session', () => {
		renderGuardedRoute(false)

		expect(screen.getByText('Login screen')).toBeVisible()
	})

	it('redirects to the home screen when there is already a session', () => {
		renderGuardedRoute(true)

		expect(screen.getByText('Home screen')).toBeVisible()
	})
})
