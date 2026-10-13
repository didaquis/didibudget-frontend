import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import { AuthContext } from '../../AuthContext'

import { NavBar } from './index'

const renderNavBar = ({ isAuth = false, isAdmin = false } = {}) => {
	return render(
		<AuthContext.Provider value={{ isAuth, userData: { isAdmin } }}>
			<MemoryRouter><NavBar /></MemoryRouter>
		</AuthContext.Provider>
	)
}

describe('NavBar', () => {
	it('names the home link', () => {
		renderNavBar()

		expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
	})

	it('offers no log in or log out link when logged out', () => {
		renderNavBar()

		expect(screen.queryByRole('link', { name: 'Log in' })).not.toBeInTheDocument()
		expect(screen.queryByRole('link', { name: 'Log out' })).not.toBeInTheDocument()
	})

	it('names the log out link when logged in', () => {
		renderNavBar({ isAuth: true })

		expect(screen.getByRole('link', { name: 'Log out' })).toHaveAttribute('href', '/logout')
	})

	it('names the user administration link for an admin', () => {
		renderNavBar({ isAuth: true, isAdmin: true })

		expect(screen.getByRole('link', { name: 'User administration' })).toHaveAttribute('href', '/users')
	})

	it('hides the user administration link from a non-admin', () => {
		renderNavBar({ isAuth: true })

		expect(screen.queryByRole('link', { name: 'User administration' })).not.toBeInTheDocument()
	})
})
