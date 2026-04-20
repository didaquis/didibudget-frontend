import { render, screen } from '@testing-library/react'

import { EmojiRedCross } from './index'

describe('EmojiRedCross', () => {
	it('should render an emoji with properly description', () => {
		render(<EmojiRedCross />)

		const element = screen.getByRole('img', { name: /Red cross mark/i })
		
		expect(element).toBeInTheDocument()
		expect(element).toHaveTextContent(/^❌$/)
	})
})