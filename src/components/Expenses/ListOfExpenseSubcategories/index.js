import PropTypes from 'prop-types'

import './styles.css'
import { EmojiListFromCategoryOrSubcategory } from '../../EmojiListFromCategoryOrSubcategory'

export const ListOfExpenseSubcategories = ({ categoryID, subcategories }) => {
	if (subcategories.length) {
		return (
			<ul className="list-group list-group-flush">
				{
					subcategories.map((subcategory) => {
						return (
							<div
								className="list-group-item list-group-item-action bg-dark border-info ms-3 subcategory-item"
								key={subcategory.uuid}
							>
								<a className="text-info me-1" href={`/register-expense/${categoryID}/${subcategory._id}`} role="button">
									{subcategory.name}
								</a>
								<EmojiListFromCategoryOrSubcategory emojis={subcategory.emojis} />
							</div>
						)
					})
				}
			</ul>
		)
	}

	return null
}


ListOfExpenseSubcategories.propTypes = {
	subcategories: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			uuid: PropTypes.string.isRequired
		})
	),
	categoryID: PropTypes.string.isRequired
}
