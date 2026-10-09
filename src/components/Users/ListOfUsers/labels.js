import { BsShieldFillCheck } from 'react-icons/bs'

export const roleLabel = (isAdmin) => (isAdmin ? 'Admin' : 'User')

export const statusLabel = (isActive) => {
	if (isActive) { return 'Active' }
	return <span className="badge bg-secondary">Inactive</span>
}

export const AdminShield = () => (
	<span className="d-inline-flex align-items-center flex-shrink-0 text-light" style={{ height: '1.5em' }} title="Admin" aria-hidden="true">
		<BsShieldFillCheck size={20} />
	</span>
)
