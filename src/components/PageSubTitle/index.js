import PropTypes from 'prop-types'

export const PageSubTitle = ( { text, children } ) => <h3 className="mt-4 mb-3 ml-4 font-weight-light text-light h5">{text}{children}</h3>

PageSubTitle.propTypes = {
	text: PropTypes.string,
	children: PropTypes.node,
}