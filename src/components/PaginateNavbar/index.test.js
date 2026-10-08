import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { PaginateNavbar } from './'

describe('PaginateNavbar', () => {
	it('should render nothing when there is a single page', () => {
		render(<PaginateNavbar currentPage={1} totalPages={1} onChangePage={vi.fn()} />)

		expect(screen.queryByRole('navigation', { name: 'Pages' })).not.toBeInTheDocument()
	})

	it('should name the navigation Pages when there are several pages', () => {
		render(<PaginateNavbar currentPage={1} totalPages={3} onChangePage={vi.fn()} />)

		expect(screen.getByRole('navigation', { name: 'Pages' })).toBeVisible()
	})

	it('should mark only the current page as current', () => {
		render(<PaginateNavbar currentPage={2} totalPages={3} onChangePage={vi.fn()} />)

		expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page')
		expect(screen.getByRole('button', { name: 'Page 1' })).not.toHaveAttribute('aria-current')
		expect(screen.getByRole('button', { name: 'Page 3' })).not.toHaveAttribute('aria-current')
	})

	it('should ask for the page that is pressed', async () => {
		const user = userEvent.setup()
		const onChangePage = vi.fn()

		render(<PaginateNavbar currentPage={1} totalPages={3} onChangePage={onChangePage} />)

		await user.click(screen.getByRole('button', { name: 'Page 3' }))

		expect(onChangePage).toHaveBeenCalledWith(3)
	})

	it('should not ask for the current page again when it is pressed', async () => {
		const user = userEvent.setup()
		const onChangePage = vi.fn()

		render(<PaginateNavbar currentPage={2} totalPages={3} onChangePage={onChangePage} />)

		await user.click(screen.getByRole('button', { name: 'Page 2' }))

		expect(onChangePage).not.toHaveBeenCalled()
	})

	it('should show the first, the last and the pages next to the current one, with ellipses between', () => {
		render(<PaginateNavbar currentPage={100} totalPages={191} onChangePage={vi.fn()} />)

		const pageButtons = screen.getAllByRole('button').map(button => button.textContent)

		expect(pageButtons).toEqual(['1', '99', '100', '101', '191'])
		expect(screen.getAllByText('…')).toHaveLength(2)
	})
})
