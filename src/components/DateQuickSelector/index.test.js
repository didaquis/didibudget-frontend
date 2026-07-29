import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { DateQuickSelector } from './index'

const startOfDay = (date) => {
	const copy = new Date(date)
	copy.setHours(0, 0, 0, 0)
	return copy
}

const today = startOfDay(new Date())

const yesterday = (() => {
	const date = startOfDay(new Date())
	date.setDate(date.getDate() - 1)
	return date
})()

describe('DateQuickSelector', () => {
	it('marks today as the selected option', () => {
		render(<DateQuickSelector value={today} onChange={vi.fn()} />)

		expect(screen.getByRole('button', { name: 'Today', pressed: true })).toBeVisible()
	})

	it('reports the start of yesterday when yesterday is chosen', async () => {
		const user = userEvent.setup()
		const onChange = vi.fn()
		render(<DateQuickSelector value={today} onChange={onChange} />)

		await user.click(screen.getByRole('button', { name: 'Yesterday' }))

		expect(onChange).toHaveBeenCalledWith(yesterday)
	})

	it('marks yesterday as selected when it is the current value', () => {
		render(<DateQuickSelector value={yesterday} onChange={vi.fn()} />)

		expect(screen.getByRole('button', { name: 'Yesterday', pressed: true })).toBeVisible()
	})

	it('keeps the calendar hidden until it is opened', async () => {
		const user = userEvent.setup()
		render(<DateQuickSelector value={today} onChange={vi.fn()} />)

		expect(screen.queryByRole('grid')).not.toBeInTheDocument()

		await user.click(screen.getByRole('button', { name: 'Pick another date' }))

		expect(screen.getByRole('grid')).toBeVisible()
	})
})
