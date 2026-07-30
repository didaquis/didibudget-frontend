import { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { roleBadge, statusBadge } from './badges'
import { formatTimeAgo } from './formatters'
import { UserListItemCard } from './UserListItemCard'

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
			<div className="row mb-4">
				<div className="col-12 col-md-6 col-lg-4">
					<input
						id="searchUsersByEmail"
						type="search"
						className="form-control"
						placeholder="Search by email..."
						aria-label="Search by email"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>

			{
				(filteredUsers.length === 0)
					?
					<p className="text-white-50" role="status">No users found</p>
					:
					<Fragment>
						<div className="d-none d-md-block">
							<div className="table-responsive">
								<table className="table table-dark table-hover">
									<thead>
										<tr className="table-info text-dark text-nowrap">
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
												<td>{roleBadge(user.isAdmin)}</td>
												<td>{statusBadge(user.isActive)}</td>
												<td>{formatTimeAgo(user.registrationDate, 'Unknown')}</td>
												<td>{formatTimeAgo(user.lastLogin, 'Never')}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						<div className="d-md-none">
							{filteredUsers.map(user => (
								<UserListItemCard key={user.uuid} user={user} />
							))}
						</div>
					</Fragment>
			}
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
			lastLogin: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
		})
	),
	startPolling: PropTypes.func.isRequired,
	stopPolling: PropTypes.func.isRequired
}
