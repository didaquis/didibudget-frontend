import { render, screen } from '@testing-library/react'

import { EmptyState } from './'

describe('EmptyState', () => {
	it('announces the message politely instead of as an alert', () => {
		render(<EmptyState message='No spending recorded yet' />)

		expect(screen.getByRole('status')).toBeVisible()
		expect(screen.getByRole('status')).toHaveTextContent('No spending recorded yet')
		expect(screen.queryByRole('alert')).not.toBeInTheDocument()
	})
})
