import { render, screen } from '@testing-library/react'
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
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Registered')).toBeInTheDocument()
    expect(screen.getByText('Last login')).toBeInTheDocument()
  })

  it('renders all users', () => {
    renderList()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.getByText('carol@example.com')).toBeInTheDocument()
  })

  it('shows Admin badge for admin users', () => {
    renderList()
    expect(screen.getAllByText('Admin')).toHaveLength(2)
  })

  it('shows User badge for non-admin users', () => {
    renderList()
    expect(screen.getByText('User')).toBeInTheDocument()
  })

  it('shows Active badge for active users', () => {
    renderList()
    expect(screen.getAllByText('Active')).toHaveLength(2)
  })

  it('shows Inactive badge for inactive users', () => {
    renderList()
    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })

  it('filters users by email search', async () => {
    const user = userEvent.setup()
    renderList()
    const input = screen.getByPlaceholderText('Search by email...')
    await user.type(input, 'alice')
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.queryByText('bob@example.com')).not.toBeInTheDocument()
    expect(screen.queryByText('carol@example.com')).not.toBeInTheDocument()
  })

  it('filters users case-insensitively', async () => {
    const user = userEvent.setup()
    renderList()
    const input = screen.getByPlaceholderText('Search by email...')
    await user.type(input, 'BOB')
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
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
    expect(screen.getAllByText(/ago/)).toHaveLength(6)
  })

  it('renders empty state when no users provided', () => {
    renderList([])
    expect(screen.getByText('Email')).toBeInTheDocument()
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
