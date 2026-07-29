import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs'

import { EmojiListFromCategoryOrSubcategory } from '../../EmojiListFromCategoryOrSubcategory'

import { flattenCategories, filterLeaves, isSameLeaf } from './utils'

const buildFrequentLeaf = (frequent) => {
	if (!frequent.subcategory) {
		return {
			key: frequent.category,
			label: frequent.categoryName,
			categoryID: frequent.category,
			subcategoryID: null,
			emojis: frequent.categoryEmojis ?? []
		}
	}

	return {
		key: `${frequent.category}-${frequent.subcategory}`,
		label: `${frequent.categoryName} › ${frequent.subcategoryName}`,
		categoryID: frequent.category,
		subcategoryID: frequent.subcategory,
		emojis: [...new Set([...(frequent.categoryEmojis ?? []), ...(frequent.subcategoryEmojis ?? [])])]
	}
}

export const CategoryPicker = ({ categories, frequentCategories, selected, onSelect }) => {
	const [filterText, setFilterText] = useState('')
	const [expandedItems, setExpandedItems] = useState({})
	const [isChanging, setIsChanging] = useState(false)

	const leaves = useMemo(() => flattenCategories(categories), [categories])
	const frequentLeaves = useMemo(() => frequentCategories.map(buildFrequentLeaf), [frequentCategories])

	const isFiltering = filterText.trim().length > 0
	const isOpen = !selected || isChanging

	const toggleItem = (uuid) => {
		setExpandedItems((previous) => ({ ...previous, [uuid]: !previous[uuid] }))
	}

	const chooseLeaf = (leaf) => {
		setIsChanging(false)
		setFilterText('')
		onSelect(leaf)
	}

	if (!isOpen) {
		const selectedLeaf = leaves.find(leaf => isSameLeaf(leaf, selected))

		return (
			<div className="d-flex align-items-center justify-content-between border border-info rounded p-2">
				<span className="text-light">
					{selectedLeaf ? selectedLeaf.label : ''} <EmojiListFromCategoryOrSubcategory emojis={selectedLeaf?.emojis ?? []} />
				</span>
				<button type="button" className="btn btn-sm btn-outline-info" onClick={() => setIsChanging(true)}>Change</button>
			</div>
		)
	}

	const filteredLeaves = filterLeaves(leaves, filterText)

	return (
		<div>
			<label htmlFor="categoryPickerFilter" className="text-light">Filter categories</label>
			<input
				id="categoryPickerFilter"
				type="search"
				className="form-control mb-3"
				placeholder="Fuel"
				value={filterText}
				onChange={(event) => setFilterText(event.target.value)}
			/>

			{
				!isFiltering && frequentLeaves.length > 0 && (
					<div className="mb-3">
						<p className="text-muted small mb-1">Frequent</p>
						<div className="d-flex flex-wrap gap-2">
							{
								frequentLeaves.map(leaf => (
									<button
										key={leaf.key}
										type="button"
										className={`btn btn-sm ${isSameLeaf(leaf, selected) ? 'btn-info' : 'btn-outline-info'}`}
										onClick={() => chooseLeaf(leaf)}
									>
										{leaf.label} <EmojiListFromCategoryOrSubcategory emojis={leaf.emojis} />
									</button>
								))
							}
						</div>
					</div>
				)
			}

			<p className="text-muted small mb-1">All</p>

			{
				isFiltering
					? (
						<ul className="list-group list-group-flush">
							{
								filteredLeaves.map(leaf => (
									<li className="list-group-item bg-dark border-info px-0" key={leaf.key}>
										<button type="button" className="btn btn-link text-start text-info p-0" onClick={() => chooseLeaf(leaf)}>
											{leaf.label}
										</button>
										<EmojiListFromCategoryOrSubcategory emojis={leaf.emojis} />
									</li>
								))
							}
						</ul>
					)
					: (
						<ul className="list-group list-group-flush">
							{
								categories.map(category => {
									const hasSubcategories = Boolean(category.subcategories?.length)
									const isExpanded = Boolean(expandedItems[category.uuid])

									if (!hasSubcategories) {
										return (
											<li className="list-group-item bg-dark border-info px-0" key={category.uuid}>
												<button
													type="button"
													className="btn btn-link text-start text-info p-0"
													onClick={() => chooseLeaf({
														key: category._id,
														label: category.name,
														categoryID: category._id,
														subcategoryID: null,
														emojis: category.emojis ?? []
													})}
												>
													{category.name}
												</button>
												<EmojiListFromCategoryOrSubcategory emojis={category.emojis} />
											</li>
										)
									}

									return (
										<li className="list-group-item bg-dark border-info px-0" key={category.uuid}>
											<button
												type="button"
												className="btn btn-link text-start text-info p-0"
												onClick={() => toggleItem(category.uuid)}
												aria-expanded={isExpanded}
											>
												{
													isExpanded
														? <BsFillCaretUpFill size={'16px'} color={'white'} className={'me-2'} />
														: <BsFillCaretDownFill size={'16px'} color={'white'} className={'me-2'} />
												}
												{category.name}
											</button>
											<EmojiListFromCategoryOrSubcategory emojis={category.emojis} />

											{
												isExpanded && (
													<ul className="list-group list-group-flush ms-3">
														{
															category.subcategories.map(subcategory => (
																<li className="list-group-item bg-dark border-info px-0" key={subcategory.uuid}>
																	<button
																		type="button"
																		className="btn btn-link text-start text-info p-0"
																		onClick={() => chooseLeaf({
																			key: `${category._id}-${subcategory._id}`,
																			label: `${category.name} › ${subcategory.name}`,
																			categoryID: category._id,
																			subcategoryID: subcategory._id,
																			emojis: [...new Set([...(category.emojis ?? []), ...(subcategory.emojis ?? [])])]
																		})}
																	>
																		{subcategory.name}
																	</button>
																	<EmojiListFromCategoryOrSubcategory emojis={subcategory.emojis} />
																</li>
															))
														}
													</ul>
												)
											}
										</li>
									)
								})
							}
						</ul>
					)
			}
		</div>
	)
}

CategoryPicker.propTypes = {
	categories: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			emojis: PropTypes.arrayOf(PropTypes.string),
			uuid: PropTypes.string.isRequired,
			subcategories: PropTypes.arrayOf(
				PropTypes.shape({
					_id: PropTypes.string.isRequired,
					name: PropTypes.string.isRequired,
					uuid: PropTypes.string.isRequired,
					emojis: PropTypes.arrayOf(PropTypes.string)
				})
			)
		})
	).isRequired,
	frequentCategories: PropTypes.arrayOf(
		PropTypes.shape({
			category: PropTypes.string.isRequired,
			categoryName: PropTypes.string.isRequired,
			categoryEmojis: PropTypes.arrayOf(PropTypes.string),
			subcategory: PropTypes.string,
			subcategoryName: PropTypes.string,
			subcategoryEmojis: PropTypes.arrayOf(PropTypes.string)
		})
	).isRequired,
	selected: PropTypes.shape({
		categoryID: PropTypes.string.isRequired,
		subcategoryID: PropTypes.string
	}),
	onSelect: PropTypes.func.isRequired
}
