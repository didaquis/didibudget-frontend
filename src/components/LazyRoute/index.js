import { Suspense } from 'react'
import PropTypes from 'prop-types'

import { Spinner } from '../Spinner'

/**
 * Suspense boundary for a lazily loaded screen. It must be mounted per route, not once around
 * the whole route tree: React only paints the fallback of a boundary that mounts during the
 * navigation, and the router wraps navigations in a transition.
 */
export const LazyRoute = ({ children }) => {
	return (
		<Suspense fallback={<Spinner />}>
			{children}
		</Suspense>
	)
}

LazyRoute.propTypes = {
	children: PropTypes.node.isRequired
}
