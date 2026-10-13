import { lazy } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, Link } from 'react-router'

import { LazyRoute } from './index'

const createLazyScreen = () => {
	const deferred = {}
	const promise = new Promise((resolve) => {
		deferred.resolve = () => resolve({
			default: () => <p>Loaded screen</p>
		})
	})
	const LazyScreen = lazy(() => promise)
	return { LazyScreen, load: deferred.resolve }
}

const renderInRouter = (ui) => render(ui, { wrapper: MemoryRouter })

/* Both routes share the same wrapper, so React would reuse the boundary unless LazyRoute remounts it */
const Guard = ({ children }) => children

describe('LazyRoute', () => {
	it('shows the spinner while the screen is still loading', () => {
		const { LazyScreen } = createLazyScreen()

		renderInRouter(<LazyRoute><LazyScreen /></LazyRoute>)

		expect(screen.getByText('Loading…')).toBeVisible()
	})

	it('shows the screen once it has loaded', async () => {
		const { LazyScreen, load } = createLazyScreen()

		renderInRouter(<LazyRoute><LazyScreen /></LazyRoute>)
		load()

		expect(await screen.findByText('Loaded screen')).toBeVisible()
	})

	it('does not show the spinner once the screen has loaded', async () => {
		const { LazyScreen, load } = createLazyScreen()

		renderInRouter(<LazyRoute><LazyScreen /></LazyRoute>)
		load()
		await screen.findByText('Loaded screen')

		expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
	})

	it('shows the spinner instead of the previous screen while the next one is loading', async () => {
		const user = userEvent.setup()
		const { LazyScreen } = createLazyScreen()

		render(
			<MemoryRouter initialEntries={['/first']}>
				<Link to='/second'>Go to second</Link>
				<Routes>
					<Route path='/first' element={<Guard><LazyRoute><p>First screen</p></LazyRoute></Guard>} />
					<Route path='/second' element={<Guard><LazyRoute><LazyScreen /></LazyRoute></Guard>} />
				</Routes>
			</MemoryRouter>
		)
		await user.click(screen.getByRole('link', { name: 'Go to second' }))

		expect(await screen.findByText('Loading…')).toBeVisible()
	})

	it('removes the previous screen while the next one is loading', async () => {
		const user = userEvent.setup()
		const { LazyScreen } = createLazyScreen()

		render(
			<MemoryRouter initialEntries={['/first']}>
				<Link to='/second'>Go to second</Link>
				<Routes>
					<Route path='/first' element={<Guard><LazyRoute><p>First screen</p></LazyRoute></Guard>} />
					<Route path='/second' element={<Guard><LazyRoute><LazyScreen /></LazyRoute></Guard>} />
				</Routes>
			</MemoryRouter>
		)
		await user.click(screen.getByRole('link', { name: 'Go to second' }))
		await screen.findByText('Loading…')

		expect(screen.queryByText('First screen')).not.toBeInTheDocument()
	})
})
