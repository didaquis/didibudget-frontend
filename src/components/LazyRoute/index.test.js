import { lazy } from 'react'
import { render, screen } from '@testing-library/react'

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

describe('LazyRoute', () => {
	it('shows the spinner while the screen is still loading', () => {
		const { LazyScreen } = createLazyScreen()

		render(<LazyRoute><LazyScreen /></LazyRoute>)

		expect(screen.getByText('Loading...')).toBeVisible()
	})

	it('shows the screen once it has loaded', async () => {
		const { LazyScreen, load } = createLazyScreen()

		render(<LazyRoute><LazyScreen /></LazyRoute>)
		load()

		expect(await screen.findByText('Loaded screen')).toBeVisible()
	})

	it('does not show the spinner once the screen has loaded', async () => {
		const { LazyScreen, load } = createLazyScreen()

		render(<LazyRoute><LazyScreen /></LazyRoute>)
		load()
		await screen.findByText('Loaded screen')

		expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
	})
})
