import { useState, useId, Fragment } from 'react'
import PropTypes from 'prop-types'

import { getNameOfCategoryOrSubcategory } from '../utils'

import { DetailedCategoryInExpensesGroup } from '../DetailedCategoryInExpensesGroup'
import { ToggleButton } from '../../ToggleButton'
import { formatAmount } from '../../../utils/currency'

export const DetailedExpensesGroup = ({ expensesGroupData, categories }) => {

	const [toggleShowDetailedInformation, setToggleShowDetailedInformation] = useState(false)
	const titleId = useId()

	const onToggleDetailedInformation = (value) => {
		setToggleShowDetailedInformation(value)
	}

	const hasSubcategories = expensesGroupData.perCategory.some(category => !!category.perSubcategory.length)

	return (
		<section className="table-responsive mb-5">
			<h2 className="h5 fw-light text-light d-flex justify-content-between gap-3 border-bottom border-info px-2 pb-2 mb-0">
				<span id={titleId} className="text-nowrap">{expensesGroupData.groupTitle}</span>
				<span className="text-nowrap">{formatAmount(expensesGroupData.groupTotal)}</span>
			</h2>
			<table className="table table-dark" aria-labelledby={titleId}>
				<tbody>
					{
						expensesGroupData.perCategory.map(category => {
							const nameOfCategory = getNameOfCategoryOrSubcategory(category.idCategory, categories)

							return (
								<Fragment key={category.idCategory}>
									<tr key={category.idCategory}>
										<td>{nameOfCategory}</td>
										<td className="text-nowrap text-end">{formatAmount(category.totalInCategory)}</td>
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
				hasSubcategories && <div className="ms-2">
					<ToggleButton
						text='Show subcategories'
						screenReaderText={`for ${expensesGroupData.groupTitle}`}
						isOnByDefault={toggleShowDetailedInformation}
						onToggle={onToggleDetailedInformation}
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
	)
}
