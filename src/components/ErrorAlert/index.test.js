import { render, screen } from '@testing-library/react'

import { ErrorAlert } from './'

describe('ErrorAlert', () => {
	it('renders correctly', () => {
		render(<ErrorAlert errorMessage='foo' />)

		expect(screen.getByRole('alert')).toBeVisible()
		expect(screen.getByText('foo')).toBeVisible()
	})
})
