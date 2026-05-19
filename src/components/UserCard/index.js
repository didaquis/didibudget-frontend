import PropTypes from 'prop-types'

export const UserCard = ({ userData }) => (
	<section className="mt-4">
		<div className="card bg-dark border-info">
			<div className="card-header">
				<h4 className="mb-0 fw-light text-light">
					Your user data
				</h4>
			</div>
			<div className="card-body pb-0 text-light">
				<p>You are logged as: <span className="ps-1 fw-light font-monospace text-secondary">{userData.email}</span></p>
				{
					userData.isAdmin && <p>You are an administrator user!</p>
				}
			</div>
		</div>
	</section>
)

UserCard.propTypes = {
	userData: PropTypes.shape({
		email: PropTypes.string.isRequired,
		isAdmin: PropTypes.bool.isRequired,
	})
}