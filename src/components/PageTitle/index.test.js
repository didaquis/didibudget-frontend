import { render, screen } from '@testing-library/react'

import { PageTitle } from './'

describe('PageTitle', () => {
	it('renders the given text as a heading', () => {
		render(<PageTitle text='foo' />)

		expect(screen.getByRole('heading', { name: 'foo' })).toBeVisible()
	})

	it('names the browser tab after the screen', () => {
		render(<PageTitle text='Spending list' />)

		expect(document.title).toBe('Spending list | didibudget')
	})
})
