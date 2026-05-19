import { useState } from 'react'
import { BsFillCaretDownFill } from 'react-icons/bs'
import { BsFillCaretUpFill } from 'react-icons/bs'
import PropTypes from 'prop-types'

import { ErrorAlert } from '../../ErrorAlert'
import { EmojiListFromCategoryOrSubcategory } from '../../EmojiListFromCategoryOrSubcategory'
import { ListOfExpenseSubcategories } from '../ListOfExpenseSubcategories'

export const ListOfExpenseCategories = ({ getExpenseCategory }) => {
	const [expandedItems, setExpandedItems] = useState({})

	const toggleItem = (uuid) => {
		setExpandedItems((prev) => ({
			...prev,
			[uuid]: !prev[uuid]
		}))
	}

	if (getExpenseCategory.length) {
		return (
			<section className="accordion mt-4 mb-5" id="listOfCategories">
				{
					getExpenseCategory.map((category) => {

						const hasSubcategories = (category.subcategories.length) ? true : false

						return (
							<div className="accordion-item bg-dark border-info" key={category.uuid}>
								<div className="accordion-header d-flex p-2">
									{
										(hasSubcategories)
											?
											<div className="d-flex align-items-center">
												<button className="btn btn-link text-start text-info" type="button" onClick={() => toggleItem(category.uuid)} aria-expanded={expandedItems[category.uuid] ? 'true' : 'false'} aria-controls={`collapse-${category.uuid}`}>
													{expandedItems[category.uuid]
														? <BsFillCaretUpFill size={'16px'} title={`Collapse the category: ${category.name}`} color={'white'} className={'me-2'} />
														: <BsFillCaretDownFill size={'16px'} title={`Expand the category: ${category.name}`} color={'white'} className={'me-2'} />
													}
													{category.name}
												</button>
												<EmojiListFromCategoryOrSubcategory emojis={category.emojis} />
											</div>
											:
											<div className="d-flex align-items-center">
												<a className="btn btn-link text-start text-info" href={`/register-expense/${category._id}`} role="button">
													{category.name}
												</a>
												<EmojiListFromCategoryOrSubcategory emojis={category.emojis} />
											</div>
									}
								</div>

								<div id={`collapse-${category.uuid}`} className={`collapse ${expandedItems[category.uuid] ? 'show' : ''}`} aria-labelledby={`heading-${category.uuid}`} style={{ display: 'grid', gridTemplateRows: expandedItems[category.uuid] ? '1fr' : '0fr', transition: 'grid-template-rows 0.35s ease-out' }}>
									<div style={{ overflow: 'hidden' }}>
										<div className="accordion-body py-0">
											<ListOfExpenseSubcategories categoryID={category._id} subcategories={category.subcategories} />
										</div>
									</div>
								</div>
							</div>
						)
					})
				}
			</section>
		)
	} else {
		const errorMessage = 'There are no categories yet'
		return <ErrorAlert errorMessage={errorMessage} />
	}
}


ListOfExpenseCategories.propTypes = {
	getExpenseCategory: PropTypes.arrayOf(
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
