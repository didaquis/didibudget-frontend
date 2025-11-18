import { Fragment } from 'react'
import PropTypes from 'prop-types'

import Toggle from 'react-toggle'
import './styles.css'

export const ToggleButton = ({ text, onToggle, isDefaultOn = false, isDisabled = false }) => {

	const onChange = e => {
		onToggle(e.target.checked)
	}

	return (
		<Fragment>
			<label className="m-0">
				<Toggle
					defaultChecked={isDefaultOn}
					disabled={isDisabled}
					onChange={onChange}
				/>
				<span className={`mx-2 text-white align-top font-weight-light ${isDisabled ? 'text-muted' : ''}`}>{text}</span>
			</label>
		</Fragment>
	)
}

ToggleButton.propTypes = {
	text: PropTypes.string.isRequired,
	onToggle: PropTypes.func.isRequired,
	isDefaultOn: PropTypes.bool,
	isDisabled: PropTypes.bool
}