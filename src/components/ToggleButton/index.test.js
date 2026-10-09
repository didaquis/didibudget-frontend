import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ToggleButton } from '.'

describe('ToggleButton', () => {
	it('is a switch named by its text, off by default', () => {
		render(<ToggleButton text='Show subcategories' onToggle={vi.fn()} />)

		expect(screen.getByRole('switch', { name: 'Show subcategories' })).not.toBeChecked()
	})

	it('adds the screen reader text to its name without showing it', () => {
		render(<ToggleButton text='Show subcategories' screenReaderText='for October 2026' onToggle={vi.fn()} />)

		expect(screen.getByRole('switch', { name: 'Show subcategories for October 2026' })).toBeInTheDocument()
		expect(screen.getByText('for October 2026')).toHaveClass('visually-hidden')
	})

	it('reports the new state when its label is tapped', async () => {
		const user = userEvent.setup()
		const onToggle = vi.fn()
		render(<ToggleButton text='Show subcategories' onToggle={onToggle} />)

		await user.click(screen.getByText('Show subcategories'))

		expect(onToggle).toHaveBeenCalledWith(true)
	})

	it('can start switched on', () => {
		render(<ToggleButton text='Show subcategories' onToggle={vi.fn()} isOnByDefault />)

		expect(screen.getByRole('switch', { name: 'Show subcategories' })).toBeChecked()
	})

	it('can be disabled', () => {
		render(<ToggleButton text='Show subcategories' onToggle={vi.fn()} isDisabled />)

		expect(screen.getByRole('switch', { name: 'Show subcategories' })).toBeDisabled()
	})
})
