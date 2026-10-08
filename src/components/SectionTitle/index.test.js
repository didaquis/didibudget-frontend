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

	it('renders at the third level unless told otherwise', () => {
		render(<SectionTitle text='biz' />)

		expect(screen.getByRole('heading', { name: 'biz', level: 3 })).toBeVisible()
	})

	it('renders at the second level when a page has no subtitles', () => {
		render(<SectionTitle text='biz' level={2} />)

		expect(screen.getByRole('heading', { name: 'biz', level: 2 })).toBeVisible()
	})
})
