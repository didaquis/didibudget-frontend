import { render, screen } from '@testing-library/react'

import { HomeHero } from './'

const renderHomeHero = () => render(<HomeHero />)

describe('HomeHero', () => {
	it('shows the tagline', () => {
		renderHomeHero()

		expect(screen.getByText('Your money, month by month.')).toBeVisible()
	})

	it('titles the screen with the didibudget wordmark', () => {
		renderHomeHero()

		expect(screen.getByRole('heading', { name: 'didibudget' })).toBeVisible()
		expect(screen.getByRole('img', { name: 'didibudget' })).toBeVisible()
	})
})
