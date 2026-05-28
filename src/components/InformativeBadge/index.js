import PropTypes from 'prop-types'

export const InformativeBadge = ({ children, className }) => (
	<span className={`badge text-dark bg-info ${className || ''}`.trim()}>{children}</span>
)

InformativeBadge.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
}