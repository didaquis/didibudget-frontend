import PropTypes from 'prop-types'
import { getTimeAgo } from '../../../utils/utils'

export const MobileUserCard = ({ user }) => (
  <div className="card bg-dark border-info mb-3">
    <div className="card-header">
      <span className="text-light">{user.email}</span>
    </div>
    <div className="card-body text-light py-2">
      <div className="d-flex justify-content-between">
        <span className="text-white-50">Role</span>
        {user.isAdmin
          ? <span className="badge bg-primary">Admin</span>
          : <span className="badge bg-secondary">User</span>}
      </div>
      <div className="d-flex justify-content-between">
        <span className="text-white-50">Status</span>
        {user.isActive
          ? <span className="badge bg-success">Active</span>
          : <span className="badge bg-danger">Inactive</span>}
      </div>
      <div className="d-flex justify-content-between">
        <span className="text-white-50">Registered</span>
        <span>{getTimeAgo(user.registrationDate)}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span className="text-white-50">Last login</span>
        <span>{getTimeAgo(user.lastLogin)}</span>
      </div>
    </div>
  </div>
)

MobileUserCard.propTypes = {
  user: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isActive: PropTypes.bool.isRequired,
    registrationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    lastLogin: PropTypes.string.isRequired
  }).isRequired
}
