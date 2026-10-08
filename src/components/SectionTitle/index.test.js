import { render, screen } from '@testing-library/react'

import { SectionTitle } from './'

describe('SectionTitle', () => {
	it('renders the given text as a heading', () => {
		render(<SectionTitle text='biz' />)

		expect(screen.getByRole('heading', { name: 'biz' })).toBeVisible()
	})

	it('renders children as a heading, flattening the markup inside', () => {
		render(<SectionTitle>Hello <strong>world</strong></SectionTitle>)

		expect(screen.getByRole('heading', { name: 'Hello world' })).toBeVisible()
	})

	it('renders as a section of the page, right under its title', () => {
		render(<SectionTitle text='biz' />)

		expect(screen.getByRole('heading', { name: 'biz', level: 2 })).toBeVisible()
	})
})
