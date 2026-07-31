import { render, screen } from '@testing-library/react'

import { SubmitButtonHelper } from './'

describe('SubmitButtonHelper', () => {
	it('renders helper text if receive true by props', () => {
		render(<SubmitButtonHelper mustShowHelper={true} />)

		expect(screen.getByText('Form submission is only enabled with valid data')).toBeVisible()
	})

	it('should not render helper text if receive false by props', () => {
		render(<SubmitButtonHelper mustShowHelper={false} />)

		expect(screen.getByText('Form submission is only enabled with valid data')).toHaveClass('invisible')
	})
})
