import PropTypes from 'prop-types'

export const SubmitButtonHelper = ({ mustShowHelper }) => {
	return (mustShowHelper) ? <small id="submitHelp" className="d-block text-muted mt-1">Form submission is only enabled with valid data</small> : null
}

SubmitButtonHelper.propTypes = {
	mustShowHelper: PropTypes.bool.isRequired
}