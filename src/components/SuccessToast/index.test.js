import { act, render, screen } from '@testing-library/react'

import { SuccessToast } from './index'

describe('SuccessToast', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it('keeps the live region mounted when there is nothing to announce', () => {
		render(<SuccessToast notice={null} />)

		expect(screen.getByRole('status')).toBeEmptyDOMElement()
	})

	it('shows the message of the notice it receives', () => {
		render(<SuccessToast notice={{ id: 1, message: '12.40 EUR · Taxes' }} />)

		expect(screen.getByRole('status')).toHaveTextContent('12.40 EUR · Taxes')
	})

	it('keeps the message on screen while it fades out, and removes it afterwards', () => {
		vi.useFakeTimers()

		render(<SuccessToast notice={{ id: 1, message: '12.40 EUR · Taxes' }} />)

		expect(screen.getByRole('status')).toHaveTextContent('12.40 EUR · Taxes')

		act(() => {
			vi.advanceTimersByTime(4000)
		})

		expect(screen.getByRole('status')).toHaveTextContent('12.40 EUR · Taxes')

		act(() => {
			vi.advanceTimersByTime(150)
		})

		expect(screen.getByRole('status')).toBeEmptyDOMElement()
	})

	it('marks the message as leaving before removing it', () => {
		vi.useFakeTimers()

		render(<SuccessToast notice={{ id: 1, message: '12.40 EUR · Taxes' }} />)

		act(() => {
			vi.advanceTimersByTime(4000)
		})

		expect(screen.getByRole('status').firstChild).toHaveClass('success-toast--leaving')
	})

	it('shows an identical message again when a new notice arrives after the previous one expired', () => {
		vi.useFakeTimers()

		const { rerender } = render(<SuccessToast notice={{ id: 1, message: '12.40 EUR · Taxes' }} />)

		act(() => {
			vi.advanceTimersByTime(4150)
		})

		expect(screen.getByRole('status')).toBeEmptyDOMElement()

		rerender(<SuccessToast notice={{ id: 2, message: '12.40 EUR · Taxes' }} />)

		expect(screen.getByRole('status')).toHaveTextContent('12.40 EUR · Taxes')
	})

	it('re-announces an identical message that arrives while the previous one is still visible', () => {
		vi.useFakeTimers()

		const { rerender } = render(<SuccessToast notice={{ id: 1, message: '12.40 EUR · Taxes' }} />)

		act(() => {
			vi.advanceTimersByTime(2000)
		})

		const firstNode = screen.getByRole('status').firstChild

		rerender(<SuccessToast notice={{ id: 2, message: '12.40 EUR · Taxes' }} />)

		// jsdom offers no other observable for "the node was replaced" than identity,
		// so we assert on it directly even though it is an implementation detail.
		expect(screen.getByRole('status').firstChild).not.toBe(firstNode)

		act(() => {
			vi.advanceTimersByTime(2500)
		})

		expect(screen.getByRole('status')).toHaveTextContent('12.40 EUR · Taxes')
	})

	it('hides the decorative check mark from assistive technology', () => {
		render(<SuccessToast notice={{ id: 1, message: '12.40 EUR · Taxes' }} />)

		expect(screen.getByRole('status').querySelector('span[aria-hidden="true"]')).toBeInTheDocument()
	})
})
