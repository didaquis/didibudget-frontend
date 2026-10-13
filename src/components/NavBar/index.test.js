import { render, screen, within, waitForElementToBeRemoved, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'

import { AuthContext } from '../../AuthContext'

import { NavBar } from './index'

const renderNavBar = ({ isAuth = true, isAdmin = false, path = '/' } = {}) => {
	const user = userEvent.setup()

	render(
		<AuthContext.Provider value={{ isAuth, userData: { isAdmin } }}>
			<MemoryRouter initialEntries={[path]}><NavBar /></MemoryRouter>
		</AuthContext.Provider>
	)

	return { user }
}

const openTheMenu = async (user) => {
	await user.click(screen.getByRole('button', { name: 'Menu' }))

	return screen.findByRole('dialog', { name: 'Menu' })
}

describe('NavBar', () => {
	it('renders nothing when logged out', () => {
		renderNavBar({ isAuth: false })

		expect(screen.queryByRole('button', { name: 'Menu' })).not.toBeInTheDocument()
	})

	it('links the wordmark to home', () => {
		renderNavBar()

		expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
	})

	it('starts with the menu closed', () => {
		renderNavBar()

		expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
	})

	it.each([
		['Spending', 'Add spending', '/spending/add'],
		['Spending', 'Spending overview', '/spending/overview'],
		['Spending', 'Spending list', '/spending/list'],
		['Spending', 'This month', '/spending/this-month'],
		['Spending', 'Last 12 months', '/spending/last-12-months'],
		['Spending', 'Month by month', '/spending/month-by-month'],
		['Spending', 'Spending search', '/spending/search'],
		['Cash, savings & investments', 'Add monthly balance', '/monthly-balance/add'],
		['Cash, savings & investments', 'Monthly balance overview', '/monthly-balance/overview'],
		['Cash, savings & investments', 'Monthly balances list', '/monthly-balance/list'],
		['Cash, savings & investments', 'Savings & investments', '/savings-and-investments'],
		['Account', 'Dashboard', '/'],
		['Account', 'Log out', '/logout']
	])('lists %s › %s in the menu', async (group, name, href) => {
		const { user } = renderNavBar()

		await openTheMenu(user)

		const list = screen.getByRole('list', { name: group })
		expect(within(list).getByRole('link', { name })).toHaveAttribute('href', href)
	})

	it('lists user administration for an admin', async () => {
		const { user } = renderNavBar({ isAdmin: true })

		await openTheMenu(user)

		expect(screen.getByRole('link', { name: 'User administration' })).toHaveAttribute('href', '/users')
	})

	it('hides user administration from a non-admin', async () => {
		const { user } = renderNavBar()

		await openTheMenu(user)

		expect(screen.queryByRole('link', { name: 'User administration' })).not.toBeInTheDocument()
	})

	it('marks the page the user is on', async () => {
		const { user } = renderNavBar({ path: '/spending/list' })

		await openTheMenu(user)

		expect(screen.getByRole('link', { name: 'Spending list' })).toHaveAttribute('aria-current', 'page')
	})

	it('closes the menu once a destination is chosen', async () => {
		const { user } = renderNavBar()
		await openTheMenu(user)

		await user.click(screen.getByRole('link', { name: 'Spending list' }))

		await waitForElementToBeRemoved(() => screen.queryByRole('dialog'))
	})

	it('closes the menu from its close button', async () => {
		const { user } = renderNavBar()
		await openTheMenu(user)

		await user.click(screen.getByRole('button', { name: 'Close' }))

		await waitForElementToBeRemoved(() => screen.queryByRole('dialog'))
	})

	it('returns focus to the menu button when closed with Escape', async () => {
		const { user } = renderNavBar()
		const dialog = await openTheMenu(user)

		// reactstrap's Modal reads keyCode, which user-event never sets
		fireEvent.keyUp(dialog, { key: 'Escape', keyCode: 27 })

		await waitForElementToBeRemoved(() => screen.queryByRole('dialog'))
		expect(screen.getByRole('button', { name: 'Menu' })).toHaveFocus()
	})
})
