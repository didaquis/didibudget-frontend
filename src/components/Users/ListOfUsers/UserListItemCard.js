import PropTypes from 'prop-types'

import { AdminShield, roleLabel, statusLabel } from './labels'
import { formatTimeAgo } from './formatters'

export const UserListItemCard = ({ user }) => (
	<div className="card bg-dark border-secondary mb-3">
		<div className="card-header d-flex justify-content-between align-items-start gap-2">
			<span className="text-light text-break" style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{user.email}</span>
			{user.isAdmin && <AdminShield />}
		</div>
		<dl className="card-body text-light py-2 mb-0 row row-cols-2 gx-3 gy-2">
			<div className="col">
				<dt className="small fw-normal lh-sm text-white-50">Role</dt>
				<dd className="mb-0 lh-sm">{roleLabel(user.isAdmin)}</dd>
			</div>
			<div className="col">
				<dt className="small fw-normal lh-sm text-white-50">Status</dt>
				<dd className="mb-0 lh-sm">{statusLabel(user.isActive)}</dd>
			</div>
			<div className="col">
				<dt className="small fw-normal lh-sm text-white-50">Joined</dt>
				<dd className="mb-0 lh-sm">{formatTimeAgo(user.registrationDate, 'Unknown')}</dd>
			</div>
			<div className="col">
				<dt className="small fw-normal lh-sm text-white-50">Last login</dt>
				<dd className="mb-0 lh-sm">{formatTimeAgo(user.lastLogin, 'Never')}</dd>
			</div>
		</dl>
	</div>
)

UserListItemCard.propTypes = {
	user: PropTypes.shape({
		email: PropTypes.string.isRequired,
		isAdmin: PropTypes.bool.isRequired,
		isActive: PropTypes.bool.isRequired,
		registrationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		lastLogin: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	}).isRequired
}
