import { render, screen } from '@testing-library/react'
import { MobileUserCard } from './MobileUserCard'

const mockUser = {
	uuid: '1',
	email: 'alice@example.com',
	isAdmin: true,
	isActive: true,
	registrationDate: 1715776800000,
	lastLogin: '1700000000'
}

const renderCard = (user = mockUser) => render(<MobileUserCard user={user} />)

describe('MobileUserCard', () => {
	it('renders email in card header', () => {
		renderCard()
		expect(screen.getByText('alice@example.com')).toBeInTheDocument()
	})

	it('renders role and status badges', () => {
		renderCard()
		expect(screen.getByText('Admin')).toBeInTheDocument()
		expect(screen.getByText('Active')).toBeInTheDocument()
	})

	it('renders User badge for non-admin', () => {
		renderCard({ ...mockUser, isAdmin: false })
		expect(screen.getByText('User')).toBeInTheDocument()
		expect(screen.queryByText('Admin')).not.toBeInTheDocument()
	})

	it('renders Inactive badge for inactive user', () => {
		renderCard({ ...mockUser, isActive: false })
		expect(screen.getByText('Inactive')).toBeInTheDocument()
		expect(screen.queryByText('Active')).not.toBeInTheDocument()
	})

	it('renders labels (Role, Status, Registered, Last login)', () => {
		renderCard()
		expect(screen.getByText('Role')).toBeInTheDocument()
		expect(screen.getByText('Status')).toBeInTheDocument()
		expect(screen.getByText('Registered')).toBeInTheDocument()
		expect(screen.getByText('Last login')).toBeInTheDocument()
	})
})
