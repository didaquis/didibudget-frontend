import PropTypes from 'prop-types'
import { BrowserRouter } from 'react-router'

/**
 * Navigations are not transitions: whatever closes with a tap (the menu) must go in the same render
 * that shows the next screen, or the previous screen shows in between.
 */
export const AppRouter = ({ children }) => (
	<BrowserRouter useTransitions={false}>
		{children}
	</BrowserRouter>
)

AppRouter.propTypes = {
	children: PropTypes.node.isRequired
}
