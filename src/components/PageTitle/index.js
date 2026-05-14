import PropTypes from 'prop-types'

export const PageTitle = ({ text }) => <h2 className="mb-3 fw-light text-light">{text}</h2>

PageTitle.propTypes = {
	text: PropTypes.string.isRequired
}