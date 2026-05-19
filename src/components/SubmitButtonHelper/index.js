import PropTypes from 'prop-types'

export const SubmitButtonHelper = ({ mustShowHelper }) => {
	return (
		<small
			id="submitHelp"
			className={`d-block text-muted mt-1 ${mustShowHelper ? '' : 'invisible'}`}
		>
			Form submission is only enabled with valid data
		</small>
	)
}

SubmitButtonHelper.propTypes = {
	mustShowHelper: PropTypes.bool.isRequired
}