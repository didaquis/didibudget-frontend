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
})
