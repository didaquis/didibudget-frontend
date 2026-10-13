import PropTypes from 'prop-types'

const SPACING = {
	page: 'my-5',
	form: 'mt-0 mb-4'
}

export const ErrorAlert = ( { errorMessage, variant = 'page' } ) => (
	<p className={`alert alert-danger py-3 text-center ${SPACING[variant]}`} role="alert">{errorMessage}</p>
)

ErrorAlert.propTypes = {
	errorMessage: PropTypes.string.isRequired,
	variant: PropTypes.oneOf(['page', 'form'])
}
