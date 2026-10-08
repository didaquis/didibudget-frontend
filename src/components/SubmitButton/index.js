import PropTypes from 'prop-types'

export const SubmitButton = ( { children, disabled, onClick } ) => {
	return (
		<div className="d-grid d-md-block">
			<button disabled={disabled} className="btn btn-lg btn-outline-info" onClick={onClick}>{children}</button>
		</div>
	)
}

SubmitButton.propTypes = {
	children: PropTypes.node.isRequired,
	disabled: PropTypes.bool,
	onClick: PropTypes.func
}
