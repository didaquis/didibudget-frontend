import { useContext } from 'react'
import { Navigate } from 'react-router'

import { AuthContext } from '../../AuthContext'

export const RequireUnauthenticated = ({ children }) => {
	const { isAuth } = useContext(AuthContext)

	if (isAuth) {
		return <Navigate to='/' />
	}

	return children
}