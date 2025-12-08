import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { SectionTitle } from './'

describe('SectionTitle', () => {
	it('renders correctly', () => {
		const { getByText } = render(<SectionTitle text='biz' />)

		expect(getByText('biz')).toBeInTheDocument()
	})

	it('renders correctly the children value', () => {
		render(<SectionTitle>Hello <strong>world</strong></SectionTitle>)

		const expectedText = 'Hello world'

		screen.getByText((content, node) => {
			const hasText = (node) => node.textContent === expectedText
			const nodeHasText = hasText(node)
			const childrenDontHaveText = Array.from(node.children).every(
			  (child) => !hasText(child)
			)

			return nodeHasText && childrenDontHaveText
		})
	})

	it('is a title', () => {
		render(<SectionTitle text='example' />)

		const nodeTitle = screen.getByText('example')

		expect(nodeTitle.localName).toBe('h3')
	})
})