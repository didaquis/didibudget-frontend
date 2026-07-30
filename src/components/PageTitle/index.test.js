import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { PageTitle } from './'

describe('PageTitle', () => {
	it('renders correctly', () => {
		const { getByText } = render(<PageTitle text='foo' />)

		expect(getByText('foo')).toBeVisible()
	})

	it('is a title', () => {
		render(<PageTitle text='foo' />)

		const nodeTitle = screen.getByText('foo')

		expect(nodeTitle.localName).toBe('h2')
	})

	it('names the browser tab after the screen', () => {
		render(<PageTitle text='Spending list' />)

		expect(document.title).toBe('Spending list | didibudget')
	})
})