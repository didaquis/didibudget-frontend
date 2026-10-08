import { render, screen } from '@testing-library/react'

import { Spinner } from '.'

describe('Spinner', () => {
	it('announces that content is loading', () => {
		render(<Spinner />)

		expect(screen.getByRole('status')).toHaveTextContent('Loading…')
	})
})
