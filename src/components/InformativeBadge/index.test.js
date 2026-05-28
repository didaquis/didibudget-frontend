import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { InformativeBadge } from './index'

describe('InformativeBadge', () => {
	it('renders children text', () => {
		render(<InformativeBadge>Some text</InformativeBadge>)

		const badge = screen.getByText('Some text')

		expect(badge).toBeVisible()
	})

	it('applies base badge classes', () => {
		render(<InformativeBadge>Badge</InformativeBadge>)

		const badge = screen.getByText('Badge')

		expect(badge).toHaveClass('badge')
		expect(badge).toHaveClass('text-dark')
		expect(badge).toHaveClass('bg-info')
	})

	it('applies additional className', () => {
		render(<InformativeBadge className='my-2'>Badge</InformativeBadge>)

		const badge = screen.getByText('Badge')

		expect(badge).toHaveClass('my-2')
	})

	it('preserves base classes when className is provided', () => {
		render(<InformativeBadge className='my-2'>Badge</InformativeBadge>)

		const badge = screen.getByText('Badge')

		expect(badge).toHaveClass('badge')
		expect(badge).toHaveClass('text-dark')
		expect(badge).toHaveClass('bg-info')
		expect(badge).toHaveClass('my-2')
	})

	it('renders with default classes when no className is provided', () => {
		render(<InformativeBadge>Badge</InformativeBadge>)

		const badge = screen.getByText('Badge')

		expect(badge.className).toBe('badge text-dark bg-info')
	})

	it('renders multiple children', () => {
		render(
			<InformativeBadge>
				<span>First</span>
				<span>Second</span>
			</InformativeBadge>,
		)

		expect(screen.getByText('First')).toBeVisible()
		expect(screen.getByText('Second')).toBeVisible()
	})
})
