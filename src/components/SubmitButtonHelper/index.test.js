import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { SubmitButtonHelper } from './'

describe('SubmitButtonHelper', () => {
	it('renders helper text if receive true by props', () => {
		const { getByText } = render(<SubmitButtonHelper mustShowHelper={true} />)

		expect(getByText('Form submission is only enabled with valid data')).toBeVisible()
	})

	it('should not render helper text if receive false by props', () => {
		const { getByText } = render(<SubmitButtonHelper mustShowHelper={false} />)

		expect(getByText('Form submission is only enabled with valid data')).toHaveClass('invisible')
	})
})