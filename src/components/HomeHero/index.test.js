import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import { HomeHero } from './'

const renderHomeHero = () => render(
	<MemoryRouter>
		<HomeHero />
	</MemoryRouter>
)

describe('HomeHero', () => {
	it('shows the headline and the subtitle', () => {
		renderHomeHero()

		expect(screen.getByText('Your money, month by month.')).toBeVisible()
		expect(screen.getByText('Track your savings and see where the spending goes.')).toBeVisible()
	})

	it('titles the screen with the didibudget wordmark', () => {
		renderHomeHero()

		expect(screen.getByRole('heading', { name: 'didibudget' })).toBeVisible()
		expect(screen.getByRole('img', { name: 'didibudget' })).toBeVisible()
	})

	it('links to the log in page', () => {
		renderHomeHero()

		expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login')
	})

	it('links to the registration page', () => {
		renderHomeHero()

		expect(screen.getByRole('link', { name: 'Create an account' })).toHaveAttribute('href', '/register')
	})
})
