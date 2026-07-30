import PropTypes from 'prop-types'

import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export const PageTitle = ({ text }) => {
	useDocumentTitle(text)

	return <h2 className="mb-3 fw-light text-light">{text}</h2>
}

PageTitle.propTypes = {
	text: PropTypes.string.isRequired
}