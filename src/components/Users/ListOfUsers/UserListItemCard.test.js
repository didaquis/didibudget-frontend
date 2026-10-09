import { render, screen } from '@testing-library/react'
import { UserListItemCard } from './UserListItemCard'

const mockUser = {
	uuid: '1',
	email: 'alice@example.com',
	isAdmin: true,
	isActive: true,
	registrationDate: '1715776800000',
	lastLogin: '1791288000000'
}

const renderCard = (user = mockUser) => render(<UserListItemCard user={user} />)

describe('UserListItemCard', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it('renders email in card header', () => {
		renderCard()
		expect(screen.getByText('alice@example.com')).toBeVisible()
	})

	it('renders Admin badge for admin', () => {
		renderCard()
		expect(screen.getByText('Admin')).toBeVisible()
		expect(screen.queryByText('User')).not.toBeInTheDocument()
	})

	it('renders User badge for non-admin', () => {
		renderCard({ ...mockUser, isAdmin: false })
		expect(screen.getByText('User')).toBeVisible()
		expect(screen.queryByText('Admin')).not.toBeInTheDocument()
	})

	it('renders Active badge for active user', () => {
		renderCard()
		expect(screen.getByText('Active')).toBeVisible()
		expect(screen.queryByText('Inactive')).not.toBeInTheDocument()
	})

	it('renders Inactive badge for inactive user', () => {
		renderCard({ ...mockUser, isActive: false })
		expect(screen.getByText('Inactive')).toBeVisible()
		expect(screen.queryByText('Active')).not.toBeInTheDocument()
	})

	it('renders a label for every field', () => {
		renderCard()
		expect(screen.getByText('Role')).toBeVisible()
		expect(screen.getByText('Status')).toBeVisible()
		expect(screen.getByText('Joined')).toBeVisible()
		expect(screen.getByText('Last login')).toBeVisible()
	})

	it('shows when the user joined and last logged in', () => {
		vi.useFakeTimers({ toFake: ['Date'] })
		vi.setSystemTime(new Date('2026-10-09T12:00:00Z'))
		renderCard()

		expect(screen.getByText('2 years ago')).toBeVisible()
		expect(screen.getByText('3 days ago')).toBeVisible()
	})

	it('renders "Never" when the user never logged in', () => {
		renderCard({ ...mockUser, lastLogin: null })
		expect(screen.getByText('Never')).toBeVisible()
	})

	it('renders "Unknown" when there is no registration date', () => {
		renderCard({ ...mockUser, registrationDate: null })
		expect(screen.getByText('Unknown')).toBeVisible()
	})
})
