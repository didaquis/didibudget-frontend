import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ListOfUsers } from './'

const mockUsers = [
	{
		uuid: '1',
		email: 'alice@example.com',
		isAdmin: true,
		isActive: true,
		registrationDate: 1715776800000,
		lastLogin: '1700000000'
	},
	{
		uuid: '2',
		email: 'bob@example.com',
		isAdmin: false,
		isActive: true,
		registrationDate: 1704976800000,
		lastLogin: '1735689600'
	},
	{
		uuid: '3',
		email: 'carol@example.com',
		isAdmin: true,
		isActive: false,
		registrationDate: 1718877600000,
		lastLogin: '1700100000'
	}
]

const mockStartPolling = vi.fn()
const mockStopPolling = vi.fn()

const renderList = (users = mockUsers) => {
	return render(
		<ListOfUsers
			users={users}
			startPolling={mockStartPolling}
			stopPolling={mockStopPolling}
		/>
	)
}

describe('ListOfUsers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders table headers', () => {
		renderList()
		const table = within(screen.getByRole('table'))
		expect(table.getByText('Email')).toBeInTheDocument()
		expect(table.getByText('Role')).toBeInTheDocument()
		expect(table.getByText('Status')).toBeInTheDocument()
		expect(table.getByText('Registered')).toBeInTheDocument()
		expect(table.getByText('Last login')).toBeInTheDocument()
	})

	it('renders all users in table and cards', () => {
		renderList()
		expect(screen.getAllByText('alice@example.com')).toHaveLength(2)
		expect(screen.getAllByText('bob@example.com')).toHaveLength(2)
		expect(screen.getAllByText('carol@example.com')).toHaveLength(2)
	})

	it('shows Admin badge in table', () => {
		renderList()
		const table = within(screen.getByRole('table'))
		expect(table.getAllByText('Admin')).toHaveLength(2)
	})

	it('shows User badge in table', () => {
		renderList()
		const table = within(screen.getByRole('table'))
		expect(table.getByText('User')).toBeInTheDocument()
	})

	it('shows Active badge in table', () => {
		renderList()
		const table = within(screen.getByRole('table'))
		expect(table.getAllByText('Active')).toHaveLength(2)
	})

	it('shows Inactive badge in table', () => {
		renderList()
		const table = within(screen.getByRole('table'))
		expect(table.getByText('Inactive')).toBeInTheDocument()
	})

	it('filters users by email search', async () => {
		const user = userEvent.setup()
		renderList()
		const input = screen.getByPlaceholderText('Search by email...')
		await user.type(input, 'alice')
		expect(screen.getAllByText('alice@example.com')).toHaveLength(2)
		expect(screen.queryByText('bob@example.com')).not.toBeInTheDocument()
		expect(screen.queryByText('carol@example.com')).not.toBeInTheDocument()
	})

	it('filters users case-insensitively', async () => {
		const user = userEvent.setup()
		renderList()
		const input = screen.getByPlaceholderText('Search by email...')
		await user.type(input, 'BOB')
		expect(screen.getAllByText('bob@example.com')).toHaveLength(2)
		expect(screen.queryByText('alice@example.com')).not.toBeInTheDocument()
	})

	it('shows no users when search matches nothing', async () => {
		const user = userEvent.setup()
		renderList()
		const input = screen.getByPlaceholderText('Search by email...')
		await user.type(input, 'zzzzz')
		expect(screen.queryByText('alice@example.com')).not.toBeInTheDocument()
	})

	it('renders relative time for registration and last login', () => {
		renderList()
		expect(screen.getAllByText(/ago/)).toHaveLength(12)
	})

	it('renders empty state when no users provided', () => {
		renderList([])
		const table = within(screen.getByRole('table'))
		expect(table.getByText('Email')).toBeInTheDocument()
	})

	it('starts polling on mount', () => {
		renderList()
		expect(mockStartPolling).toHaveBeenCalledTimes(1)
		expect(mockStartPolling).toHaveBeenCalledWith(600000)
	})

	it('stops polling on unmount', () => {
		const { unmount } = renderList()
		unmount()
		expect(mockStopPolling).toHaveBeenCalledTimes(1)
	})
})
