import { useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { BsFillCaretDownFill, BsFillCaretUpFill, BsX } from 'react-icons/bs'

import { EmojiListFromCategoryOrSubcategory } from '../../EmojiListFromCategoryOrSubcategory'

import { flattenCategories, filterLeaves, isSameLeaf, buildLeaf } from './utils'

import './styles.css'

const LEAF_ROW_CLASS_NAME = 'btn btn-link text-start text-info text-decoration-none w-100 px-0'

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
	const [isTreeShown, setIsTreeShown] = useState(false)
	const filterInput = useRef(null)

	const leaves = useMemo(() => flattenCategories(categories), [categories])
	const frequentLeaves = useMemo(() => frequentCategories.map(buildFrequentLeaf), [frequentCategories])

	const isFiltering = filterText.trim().length > 0
	const hasFrequentLeaves = frequentLeaves.length > 0

	const toggleItem = (uuid) => {
		setExpandedItems((previous) => ({ ...previous, [uuid]: !previous[uuid] }))
	}

	const clearFilter = () => {
		setFilterText('')
		filterInput.current.focus()
	}

	const chooseLeaf = (leaf) => {
		setIsTreeShown(false)
		setFilterText('')
		onSelect(leaf)
	}

	if (selected) {
		const selectedLeaf = leaves.find(leaf => isSameLeaf(leaf, selected))
		const label = selected.label ?? selectedLeaf?.label ?? 'Unknown category'
		const emojis = selected.emojis ?? selectedLeaf?.emojis ?? []

		return (
			<div className="d-flex align-items-center justify-content-between border border-info rounded p-2">
				<span className="text-light">
					{label} <EmojiListFromCategoryOrSubcategory emojis={emojis} />
				</span>
				<button type="button" className="btn btn-sm btn-outline-info" onClick={() => onSelect(null)}>Change</button>
			</div>
		)
	}

	const filteredLeaves = filterLeaves(leaves, filterText)

	return (
		<div className="category-picker">
			<div className="input-group mb-3">
				<input
					id="categoryPickerFilter"
					type="text"
					inputMode="search"
					enterKeyHint="search"
					className="form-control"
					placeholder="Search categories…"
					aria-label="Search categories"
					value={filterText}
					onChange={(event) => setFilterText(event.target.value)}
					ref={filterInput}
				/>
				{
					(filterText !== '') && (
						<button
							type="button"
							className="btn btn-light"
							aria-label="Clear search"
							onClick={clearFilter}
						>
							<BsX size={'24px'} />
						</button>
					)
				}
			</div>

			{
				!isFiltering && hasFrequentLeaves && (
					<div className="mb-3">
						<p className="text-light small mb-1">Most used</p>
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

			{
				!isFiltering && !hasFrequentLeaves && <p className="text-light small mb-0">All categories</p>
			}

			{
				!isFiltering && hasFrequentLeaves && (
					<button
						type="button"
						className="btn btn-link text-start text-light text-decoration-none w-100 px-0 mb-1 d-flex align-items-center"
						onClick={() => setIsTreeShown(previous => !previous)}
						aria-expanded={isTreeShown}
					>
						{
							isTreeShown
								? <BsFillCaretUpFill size={'16px'} color={'white'} className={'me-2'} />
								: <BsFillCaretDownFill size={'16px'} color={'white'} className={'me-2'} />
						}
						All categories
					</button>
				)
			}

			{
				isFiltering && filteredLeaves.length === 0 && <p className="text-white-50" role="status">No categories found</p>
			}

			{
				isFiltering && filteredLeaves.length > 0
					? (
						<ul className="list-group list-group-flush">
							{
								filteredLeaves.map((leaf, index) => (
									<li className={`list-group-item bg-dark border-info px-0 py-1 ${index === 0 ? 'pt-0' : ''}`} key={leaf.key}>
										<button type="button" className={LEAF_ROW_CLASS_NAME} onClick={() => chooseLeaf(leaf)}>
											<span className="text-decoration-underline">{leaf.label}</span>
											<EmojiListFromCategoryOrSubcategory emojis={leaf.emojis} />
										</button>
									</li>
								))
							}
						</ul>
					)
					: !isFiltering && (!hasFrequentLeaves || isTreeShown) && (
						<ul className="list-group list-group-flush">
							{
								categories.map((category, index) => {
									const hasSubcategories = Boolean(category.subcategories?.length)
									const isExpanded = Boolean(expandedItems[category.uuid])
									const itemClassName = `list-group-item bg-dark border-info px-0 py-1 ${index === 0 ? 'pt-0' : ''}`

									if (!hasSubcategories) {
										const leaf = buildLeaf(category, null)

										return (
											<li className={itemClassName} key={category.uuid}>
												<button
													type="button"
													className={LEAF_ROW_CLASS_NAME}
													onClick={() => chooseLeaf(leaf)}
												>
													<span className="text-decoration-underline">{category.name}</span>
													<EmojiListFromCategoryOrSubcategory emojis={leaf.emojis} />
												</button>
											</li>
										)
									}

									const categoryLeaf = buildLeaf(category, null)

									return (
										<li className={itemClassName} key={category.uuid}>
											<button
												type="button"
												className="btn btn-link text-start text-light text-decoration-none w-100 px-0 d-flex align-items-center"
												onClick={() => toggleItem(category.uuid)}
												aria-expanded={isExpanded}
											>
												{
													isExpanded
														? <BsFillCaretUpFill size={'16px'} color={'white'} className={'me-2 flex-shrink-0'} />
														: <BsFillCaretDownFill size={'16px'} color={'white'} className={'me-2 flex-shrink-0'} />
												}
												<span>
													{category.name}
													<EmojiListFromCategoryOrSubcategory emojis={categoryLeaf.emojis} />
												</span>
											</button>

											{
												isExpanded && (
													<ul className="list-group list-group-flush ms-3" aria-label={`Subcategories of ${category.name}`}>
														{
															category.subcategories.map(subcategory => {
																const subcategoryLeaf = buildLeaf(category, subcategory)

																return (
																	<li className="list-group-item bg-dark border-info px-0 py-1" key={subcategory.uuid}>
																		<button
																			type="button"
																			className={LEAF_ROW_CLASS_NAME}
																			onClick={() => chooseLeaf(subcategoryLeaf)}
																		>
																			<span className="text-decoration-underline">{subcategory.name}</span>
																			{/* Own emojis only: subcategoryLeaf merges them with the parent category ones */}
																			<EmojiListFromCategoryOrSubcategory emojis={subcategory.emojis ?? []} />
																		</button>
																	</li>
																)
															})
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
		subcategoryID: PropTypes.string,
		label: PropTypes.string,
		emojis: PropTypes.arrayOf(PropTypes.string)
	}),
	onSelect: PropTypes.func.isRequired
}
