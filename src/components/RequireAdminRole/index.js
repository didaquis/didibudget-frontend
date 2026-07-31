import { useContext } from 'react'
import { Navigate } from 'react-router'

import { AuthContext } from '../../AuthContext'

export const RequireAdminRole = ({ children }) => {
	const { userData } = useContext(AuthContext)

	if (userData.isAdmin !== true) {
		return <Navigate to="/" />
	}

	return children
}