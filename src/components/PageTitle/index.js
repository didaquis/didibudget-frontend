import PropTypes from 'prop-types'

import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export const PageTitle = ({ text }) => {
	useDocumentTitle(text)

	return <h1 className="h2 mb-3 fw-light text-light">{text}</h1>
}

PageTitle.propTypes = {
	text: PropTypes.string.isRequired
}