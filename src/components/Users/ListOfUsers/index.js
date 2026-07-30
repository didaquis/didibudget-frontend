import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { getTimeAgo } from '../../../utils/utils'
import './styles.css'

const roleBadge = (isAdmin) => {
	if (isAdmin) { return <span className="badge-admin">Admin</span> }
	return <span className="badge-user">User</span>
}

const statusBadge = (isActive) => {
	if (isActive) { return <span className="badge-active">Active</span> }
	return <span className="badge-inactive">Inactive</span>
}

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
				type="search"
				className="form-control mb-3"
				placeholder="Search by email..."
				aria-label="Search by email"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<div className="table-responsive">
				<table className="table text-light responsive-table">
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
								<td data-label="Email">{user.email}</td>
								<td data-label="Role">{roleBadge(user.isAdmin)}</td>
								<td data-label="Status">{statusBadge(user.isActive)}</td>
								<td data-label="Registered">{getTimeAgo(user.registrationDate)}</td>
								<td data-label="Last login">{getTimeAgo(user.lastLogin)}</td>
							</tr>
						))}
					</tbody>
				</table>
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
