import { Fragment } from 'react'
import PropTypes from 'prop-types'

export const EmojiListFromCategoryOrSubcategory = ({ emojis }) => {
	
	return (
		<Fragment>
			{
				emojis.map(emoji => {
					return (
						<Fragment key={emoji}>
							<span role="img" className="ml-2" aria-hidden="true">{ emoji }</span>
						</Fragment>
					)
				})
			}
		</Fragment>
	)
}

EmojiListFromCategoryOrSubcategory.propTypes = {
	emojis: PropTypes.arrayOf(
		PropTypes.string
	),
}