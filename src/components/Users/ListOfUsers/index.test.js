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

const getTable = () => within(screen.getByRole('table'))

const getSearchInput = () => screen.getByRole('textbox', { name: 'Search by email' })

const getClearButton = () => screen.getByRole('button', { name: 'Clear search' })

describe('ListOfUsers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders table headers', () => {
		renderList()
		const table = getTable()
		expect(table.getByText('Email')).toBeVisible()
		expect(table.getByText('Role')).toBeVisible()
		expect(table.getByText('Status')).toBeVisible()
		expect(table.getByText('Registration')).toBeVisible()
		expect(table.getByText('Last login')).toBeVisible()
	})

	it('renders every user in the table', () => {
		renderList()
		const table = getTable()
		expect(table.getByText('alice@example.com')).toBeVisible()
		expect(table.getByText('bob@example.com')).toBeVisible()
		expect(table.getByText('carol@example.com')).toBeVisible()
	})

	// The desktop table and the mobile cards are both rendered, and Bootstrap
	// shows only one of them per breakpoint. jsdom applies no CSS, so this is
	// the single place that asserts the duplication.
	it('renders both a table row and a mobile card for every user', () => {
		renderList()
		expect(screen.getAllByText('alice@example.com')).toHaveLength(2)
		expect(screen.getAllByText('bob@example.com')).toHaveLength(2)
		expect(screen.getAllByText('carol@example.com')).toHaveLength(2)
	})

	it('shows Admin badge in table for admin users', () => {
		renderList()
		expect(getTable().getAllByText('Admin')).toHaveLength(2)
	})

	it('shows User badge in table for non-admin users', () => {
		renderList()
		expect(getTable().getByText('User')).toBeVisible()
	})

	it('shows Active badge in table for active users', () => {
		renderList()
		expect(getTable().getAllByText('Active')).toHaveLength(2)
	})

	it('shows Inactive badge in table for inactive users', () => {
		renderList()
		expect(getTable().getByText('Inactive')).toBeVisible()
	})

	it('renders relative time for registration and last login', () => {
		renderList()
		expect(getTable().getAllByText(/ago/)).toHaveLength(6)
	})

	it('filters users by email search', async () => {
		const user = userEvent.setup()
		renderList()

		await user.type(getSearchInput(), 'alice')

		expect(getTable().getByText('alice@example.com')).toBeVisible()
		expect(screen.queryByText('bob@example.com')).not.toBeInTheDocument()
		expect(screen.queryByText('carol@example.com')).not.toBeInTheDocument()
	})

	it('filters users case-insensitively', async () => {
		const user = userEvent.setup()
		renderList()

		await user.type(getSearchInput(), 'BOB')

		expect(getTable().getByText('bob@example.com')).toBeVisible()
		expect(screen.queryByText('alice@example.com')).not.toBeInTheDocument()
	})

	it('hides the clear button while the search is empty', () => {
		renderList()

		expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
	})

	it('offers a clear button once something is typed', async () => {
		const user = userEvent.setup()
		renderList()

		await user.type(getSearchInput(), 'alice')

		expect(getClearButton()).toBeVisible()
	})

	it('empties the search and restores every user when the clear button is used', async () => {
		const user = userEvent.setup()
		renderList()
		await user.type(getSearchInput(), 'alice')

		await user.click(getClearButton())

		expect(getSearchInput()).toHaveValue('')
		expect(getTable().getByText('bob@example.com')).toBeVisible()
	})

	it('returns the focus to the search input after clearing', async () => {
		const user = userEvent.setup()
		renderList()
		await user.type(getSearchInput(), 'alice')

		await user.click(getClearButton())

		expect(getSearchInput()).toHaveFocus()
	})

	it('shows a no results message when search matches nothing', async () => {
		const user = userEvent.setup()
		renderList()

		await user.type(getSearchInput(), 'zzzzz')

		expect(screen.getByText('No users found')).toBeVisible()
		expect(screen.queryByText('alice@example.com')).not.toBeInTheDocument()
		expect(screen.queryByRole('table')).not.toBeInTheDocument()
	})

	it('shows a no results message when no users provided', () => {
		renderList([])
		expect(screen.getByText('No users found')).toBeVisible()
		expect(screen.queryByRole('table')).not.toBeInTheDocument()
	})

	it('keeps the search input available when there are no results', () => {
		renderList([])
		expect(getSearchInput()).toBeVisible()
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
