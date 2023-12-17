import PropTypes from 'prop-types'

import { getNameOfCategoryOrSubcategory } from '../utils'

export const DetailedCategoryInExpensesGroup = ( { displaySubcategories, categoryInGroup, categories } ) => {

	const hasSubcategories = categoryInGroup.perSubcategory.length

	if (!hasSubcategories) {
		return null
	}

	return (
		displaySubcategories && <tr>
			<td colSpan="2" className="pt-0 pb-4 text-info">
				{
					categoryInGroup.perSubcategory.map(subcategory => {
						const nameOfSubcategory = getNameOfCategoryOrSubcategory(subcategory.idSubcategory, categories)
						return (
							<div className="ml-4 py-2 pl-2 d-flex border border-info border-top-0 border-bottom-0 border-right-0" key={subcategory.idSubcategory} >
								<div className="mr-auto px-2">{nameOfSubcategory}</div>
								<div className="px-2 text-nowrap text-right">{subcategory.totalInSubcategory} EUR</div>
							</div>
						)
					})
				}
			</td>
		</tr>	
	)
}

DetailedCategoryInExpensesGroup.propTypes = {
	displaySubcategories: PropTypes.bool.isRequired,
	categoryInGroup: PropTypes.shape({
		idCategory: PropTypes.string.isRequired,
		totalInCategory: PropTypes.number.isRequired,
		perSubcategory: PropTypes.array.isRequired,
	}),
	categories: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			subcategories: PropTypes.arrayOf(
				PropTypes.shape({
					_id: PropTypes.string.isRequired,
					name: PropTypes.string.isRequired,
					uuid: PropTypes.string.isRequired
				})
			),
			uuid: PropTypes.string.isRequired
		})
	)
}
