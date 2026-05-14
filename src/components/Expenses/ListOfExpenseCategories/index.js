import { BsFillCaretDownFill } from 'react-icons/bs'
import PropTypes from 'prop-types'

import { ErrorAlert } from '../../ErrorAlert'
import { EmojiListFromCategoryOrSubcategory } from '../../EmojiListFromCategoryOrSubcategory'
import { ListOfExpenseSubcategories } from '../ListOfExpenseSubcategories'

export const ListOfExpenseCategories = ({ getExpenseCategory }) => {
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
												<button className="btn btn-link text-start text-info" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${category.uuid}`} aria-expanded="true" aria-controls={`collapse-${category.uuid}`}>
													<BsFillCaretDownFill
														size={'16px'}
														title={`Expand the category: ${category.name}`}
														color={'white'}
														className={'me-2'}
													/>
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

								<div id={`collapse-${category.uuid}`} className="collapse" aria-labelledby={`heading-${category.uuid}`} data-parent="#listOfCategories">
									<div className="accordion-body">
										<ListOfExpenseSubcategories categoryID={category._id} subcategories={category.subcategories} />
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
