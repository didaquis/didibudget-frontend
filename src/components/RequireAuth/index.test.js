import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'

import { RequireAuth } from './index'
import { AuthContext } from '../../AuthContext'

const LoginProbe = () => {
	const location = useLocation()

	return <p>{`Login screen, coming from ${location.state?.from?.pathname ?? 'nowhere'}`}</p>
}

const renderGuardedRoute = (isAuth) => {
	return render(
		<AuthContext.Provider value={{ isAuth }}>
			<MemoryRouter initialEntries={['/add-expense']}>
				<Routes>
					<Route path='/add-expense' element={
						<RequireAuth>
							<p>Protected screen</p>
						</RequireAuth>
					} />
					<Route path='/login' element={<LoginProbe />} />
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

	it('sends the user to the login screen keeping the attempted location', () => {
		renderGuardedRoute(false)

		expect(screen.getByText('Login screen, coming from /add-expense')).toBeVisible()
	})
})
