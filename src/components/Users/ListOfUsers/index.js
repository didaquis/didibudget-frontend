import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { getTimeAgo } from '../../../utils/utils'
import { MobileUserCard } from './MobileUserCard'

export const ListOfUsers = ({ users, startPolling, stopPolling }) => {
	const [search, setSearch] = useState('')

	useEffect(() => {
		const minuteInMilliseconds = 60000
		const tenMinutes = minuteInMilliseconds * 10
		startPolling(tenMinutes)

		return () => {
			stopPolling()
		}
	}, [startPolling, stopPolling])

	const filteredUsers = users.filter(user =>
		user.email.toLowerCase().includes(search.toLowerCase())
	)

	return (
		<section>
			<input
				id="searchUsersByEmail"
				type="search"
				className="form-control mb-3"
				placeholder="Search by email..."
				aria-label="Search by email"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>

			<div className="d-none d-md-block">
				<div className="table-responsive">
					<table className="table table-dark">
						<thead>
							<tr>
								<th scope="col">Email</th>
								<th scope="col">Role</th>
								<th scope="col">Status</th>
								<th scope="col">Registered</th>
								<th scope="col">Last login</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.map(user => (
								<tr key={user.uuid}>
									<td>{user.email}</td>
									<td>
										{user.isAdmin
											? <span className="badge bg-primary">Admin</span>
											: <span className="badge bg-secondary">User</span>}
									</td>
									<td>
										{user.isActive
											? <span className="badge bg-success">Active</span>
											: <span className="badge bg-danger">Inactive</span>}
									</td>
									<td>{getTimeAgo(user.registrationDate)}</td>
									<td>{getTimeAgo(user.lastLogin)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<div className="d-md-none">
				{filteredUsers.map(user => (
					<MobileUserCard key={user.uuid} user={user} />
				))}
			</div>
		</section>
	)
}

ListOfUsers.propTypes = {
	users: PropTypes.arrayOf(
		PropTypes.shape({
			email: PropTypes.string.isRequired,
			uuid: PropTypes.string.isRequired,
			isAdmin: PropTypes.bool.isRequired,
			isActive: PropTypes.bool.isRequired,
			registrationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			lastLogin: PropTypes.string.isRequired
		})
	),
	startPolling: PropTypes.func.isRequired,
	stopPolling: PropTypes.func.isRequired
}
