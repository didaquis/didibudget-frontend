import PropTypes from 'prop-types'

export const EmptyState = ( { message } ) => (
	<p className="alert alert-info py-3 text-center my-5" role="status">{message}</p>
)

EmptyState.propTypes = {
	message: PropTypes.string.isRequired
}
