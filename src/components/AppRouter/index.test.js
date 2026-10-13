import { Profiler } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router'

import { AuthContext } from '../../AuthContext'
import { NavBar } from '../NavBar'

import { AppRouter } from './index'

/* What is on screen after each render React commits */
const renderAppAt = (path) => {
	const user = userEvent.setup()
	const commits = []
	const recordCommit = () => commits.push({
		menuIsOpen: screen.getByRole('button', { name: 'Menu', hidden: true }).getAttribute('aria-expanded') === 'true',
		previousScreenIsShown: screen.queryByRole('heading', { name: 'Previous screen' }) !== null
	})
	window.history.pushState({}, '', path)

	render(
		<AuthContext.Provider value={{ isAuth: true, userData: { isAdmin: false } }}>
			<Profiler id='app' onRender={recordCommit}>
				<AppRouter>
					<NavBar />
					<Routes>
						<Route path='/spending/list' element={<h1>Previous screen</h1>} />
						<Route path='/spending/overview' element={<h1>Next screen</h1>} />
					</Routes>
				</AppRouter>
			</Profiler>
		</AuthContext.Provider>
	)

	return { user, commits }
}

describe('AppRouter', () => {
	it('shows the screen chosen from the menu', async () => {
		const { user } = renderAppAt('/spending/list')

		await user.click(screen.getByRole('button', { name: 'Menu' }))
		await user.click(await screen.findByRole('link', { name: 'Spending overview' }))

		expect(await screen.findByRole('heading', { name: 'Next screen' })).toBeVisible()
	})

	it('never shows the previous screen once the menu has closed', async () => {
		const { user, commits } = renderAppAt('/spending/list')

		await user.click(screen.getByRole('button', { name: 'Menu' }))
		const link = await screen.findByRole('link', { name: 'Spending overview' })
		commits.length = 0
		await user.click(link)
		await screen.findByRole('heading', { name: 'Next screen' })

		expect(commits).not.toContainEqual({ menuIsOpen: false, previousScreenIsShown: true })
	})
})
