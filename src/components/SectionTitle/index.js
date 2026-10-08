import PropTypes from 'prop-types'

export const SectionTitle = ({ text, children, level = 3 }) => {
	const Heading = `h${level}`

	return <Heading className="mt-4 mb-3 fw-light text-light h5">{text}{children}</Heading>
}

SectionTitle.propTypes = {
	text: PropTypes.string,
	children: PropTypes.node,
	level: PropTypes.oneOf([2, 3]),
}
