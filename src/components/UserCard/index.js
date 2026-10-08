import PropTypes from 'prop-types'

import { SectionTitle } from '../SectionTitle'

export const UserCard = ({ userData }) => (
	<section className="mt-5 text-light">
		<SectionTitle text='Your user data' level={2} />
		<p>You are logged as: <span className="ps-1 font-monospace text-white-50">{userData.email}</span></p>
		{
			userData.isAdmin && <p>You are an administrator user!</p>
		}
	</section>
)

UserCard.propTypes = {
	userData: PropTypes.shape({
		email: PropTypes.string.isRequired,
		isAdmin: PropTypes.bool.isRequired,
	})
}