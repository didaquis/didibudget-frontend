import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { PageSubTitle } from './'

describe('PageSubTitle', () => {
	it('renders the given text as a heading', () => {
		render(<PageSubTitle text='biz' />)

		expect(screen.getByRole('heading', { name: 'biz' })).toBeVisible()
	})

	it('renders children as a heading, flattening the markup inside', () => {
		render(<PageSubTitle>Hello <strong>world</strong></PageSubTitle>)

		expect(screen.getByRole('heading', { name: 'Hello world' })).toBeVisible()
	})
})
