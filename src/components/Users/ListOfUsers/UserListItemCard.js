import PropTypes from 'prop-types'

import { roleBadge, statusBadge } from './badges'
import { formatTimeAgo } from './formatters'

export const UserListItemCard = ({ user }) => (
	<div className="card bg-dark border-info mb-3">
		<div className="card-header">
			<span className="text-light text-break">{user.email}</span>
		</div>
		<div className="card-body text-light py-2 d-flex flex-column gap-2">
			<div className="d-flex justify-content-between align-items-center">
				<span className="text-white-50">Role</span>
				{roleBadge(user.isAdmin)}
			</div>
			<div className="d-flex justify-content-between align-items-center">
				<span className="text-white-50">Status</span>
				{statusBadge(user.isActive)}
			</div>
			<div className="d-flex justify-content-between align-items-center">
				<span className="text-white-50">Registered</span>
				<span>{formatTimeAgo(user.registrationDate, 'Unknown')}</span>
			</div>
			<div className="d-flex justify-content-between align-items-center">
				<span className="text-white-50">Last login</span>
				<span>{formatTimeAgo(user.lastLogin, 'Never')}</span>
			</div>
		</div>
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
