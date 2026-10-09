import { useId } from 'react'
import PropTypes from 'prop-types'

import './styles.css'

export const ToggleButton = ({ text, screenReaderText, onToggle, isOnByDefault = false, isDisabled = false }) => {
	const id = useId()

	const onChange = e => {
		onToggle(e.target.checked)
	}

	return (
		<div className="toggle-button form-check form-switch mb-0">
			<input
				className="form-check-input"
				type="checkbox"
				role="switch"
				id={id}
				defaultChecked={isOnByDefault}
				disabled={isDisabled}
				onChange={onChange}
			/>
			<label className="form-check-label text-white fw-light ms-2" htmlFor={id}>
				{text}
				{screenReaderText && <span className="visually-hidden"> {screenReaderText}</span>}
			</label>
		</div>
	)
}

ToggleButton.propTypes = {
	text: PropTypes.string.isRequired,
	screenReaderText: PropTypes.string,
	onToggle: PropTypes.func.isRequired,
	isOnByDefault: PropTypes.bool,
	isDisabled: PropTypes.bool
}
