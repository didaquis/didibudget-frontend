export const roleBadge = (isAdmin) => {
	if (isAdmin) { return <span className="badge bg-primary">Admin</span> }
	return <span className="badge bg-secondary">User</span>
}

export const statusBadge = (isActive) => {
	if (isActive) { return <span className="badge bg-success">Active</span> }
	return <span className="badge bg-danger">Inactive</span>
}
