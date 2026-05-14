import PropTypes from 'prop-types'

export const SectionTitle = ({ text, children }) => <h3 className="mt-4 mb-3 fw-light text-light h5">{text}{children}</h3>

SectionTitle.propTypes = {
	text: PropTypes.string,
	children: PropTypes.node,
}