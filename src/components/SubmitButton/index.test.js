import { render, fireEvent } from '@testing-library/react'

import { SubmitButton } from './'

describe('SubmitButton', () => {
	it('renders correctly', () => {
		const handleClick = () => {}
		const { getByRole } = render(<SubmitButton disabled={false} onClick={handleClick}>Submit</SubmitButton>)

		expect(getByRole('button', { name: /^Submit$/i } )).toBeInTheDocument()
	})

	it('renders a button disabled or not depending of the props', () => {
		const handleClick = () => {}
		const { getByRole, rerender } = render(<SubmitButton disabled={true} onClick={handleClick}>Submit</SubmitButton>)

		expect(getByRole('button', { name: /^Submit$/i } )).toBeDisabled()

		rerender(<SubmitButton disabled={false} onClick={handleClick}>Submit</SubmitButton>)

		expect(getByRole('button', { name: /^Submit$/i } )).not.toBeDisabled()
	})

	it('captures clicks', () => {
		const handleClick = vi.fn()

		const { getByRole } = render(
			<SubmitButton onClick={handleClick}>Submit</SubmitButton>
		)

		const node = getByRole('button', { name: /^Submit$/i } )

		expect(handleClick).not.toHaveBeenCalled()
		fireEvent.click(node)
		expect(handleClick).toHaveBeenCalled()
	})
})