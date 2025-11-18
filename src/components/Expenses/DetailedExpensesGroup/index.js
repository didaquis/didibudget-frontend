import { useState, Fragment } from 'react'
import PropTypes from 'prop-types'

import { getNameOfCategoryOrSubcategory } from '../utils'

import { DetailedCategoryInExpensesGroup } from '../DetailedCategoryInExpensesGroup'
import { ToggleButton } from '../../ToggleButton'

export const DetailedExpensesGroup = ( { expensesGroupData, categories, isDetailedInformationDisplayedByDefault = false } ) => {

	const [toggleShowDetailedInformation, setToggleShowDetailedInformation] = useState(isDetailedInformationDisplayedByDefault)

	const onToggleDetailedInformation = (value) => {
		setToggleShowDetailedInformation(value)
	}

	const hasSubcategories = expensesGroupData.perCategory.some(category => !!category.perSubcategory.length)

	return (
		<section className="table-responsive mb-5">
			<table className="table table-dark">
				<thead>
					<tr className="table-info text-dark">
						<th scope="col" className="text-nowrap">{expensesGroupData.groupTitle}</th>
						<th scope="col" className="text-nowrap text-right">{expensesGroupData.groupTotal} EUR</th>
					</tr>
				</thead>
				<tbody>
					{
						expensesGroupData.perCategory.map(category => {
							const nameOfCategory = getNameOfCategoryOrSubcategory(category.idCategory, categories)
							
							return (
								<Fragment key={category.idCategory}>
									<tr key={category.idCategory}>
										<td>{nameOfCategory}</td>
										<td className="text-nowrap text-right">{category.totalInCategory} EUR</td>
									</tr>
									<DetailedCategoryInExpensesGroup
										displaySubcategories={toggleShowDetailedInformation}
										categoryInGroup={category}
										categories={categories}
									/>
								</Fragment>
							)
						})
					}
				</tbody>
			</table>
			{
				hasSubcategories && <div className="ml-2">
					<ToggleButton
						text='Show detailed information'
						isDefaultOn={toggleShowDetailedInformation}
						onToggle={onToggleDetailedInformation}
						isDisabled={!hasSubcategories}
					/>
				</div>
			}
		</section>
	)
}


DetailedExpensesGroup.propTypes = {
	expensesGroupData: PropTypes.shape({
		groupTitle: PropTypes.string.isRequired,
		groupTotal: PropTypes.number.isRequired,
		perCategory: PropTypes.array.isRequired,
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
	),
	isDetailedInformationDisplayedByDefault: PropTypes.bool
}
