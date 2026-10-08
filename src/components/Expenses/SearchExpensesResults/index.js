import { useState } from 'react'
import PropTypes from 'prop-types'

import { parseUnixTimestamp } from '../../../utils/utils'
import { getNameOfCategoryOrSubcategory } from '../utils'

import { EmptyState } from '../../EmptyState'
import { PaginateNavbar } from '../../PaginateNavbar'
import { formatAmount } from '../../../utils/currency'
import './styles.css'

const DATE_LENGTH = 10
const TOP_BREAKDOWN_ROWS = 5
const BREAKDOWN_LIST_ID = 'searchExpensesBreakdown'

/**
 * Get the displayable name of a category and its subcategory
 * @param {string} category
 * @param {string|null} subcategory
 * @param {Array} categories
 * @returns {string}
 */
const getFullName = (category, subcategory, categories) => {
	const nameOfCategory = getNameOfCategoryOrSubcategory(category, categories) ?? ''
	const nameOfSubcategory = getNameOfCategoryOrSubcategory(subcategory, categories)

	return `${nameOfCategory}${(nameOfSubcategory) ? ` - ${nameOfSubcategory}` : ''}`
}

/**
 * Get a number of spends with its noun, so the figure is never displayed unlabelled
 * @example
 * 	getSpendsLabel(1) // '1 spend'
 * @param {number} count
 * @returns {string}
 */
const getSpendsLabel = (count) => `${count} ${(count === 1) ? 'spend' : 'spends'}`

export const SearchExpensesResults = ({ searchResult, categories, onChangePage }) => {
	const { expenses, pagination, totalSum, currencyISO, breakdown } = searchResult
	const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(false)

	if (!expenses.length) {
		return <EmptyState message='No spending matches this search. Try adjusting the filters' />
	}

	// The backend sorts the breakdown by amount, so the first rows are the ones with the most spending
	const isBreakdownLong = breakdown.length > TOP_BREAKDOWN_ROWS
	const visibleBreakdown = (isBreakdownExpanded) ? breakdown : breakdown.slice(0, TOP_BREAKDOWN_ROWS)

	return (
		<section>
			<section className="card bg-dark border-info mb-4" aria-label="Search summary">
				<div className="card-body">
					<p className="text-light mb-1">Total spent</p>
					<p className="h3 text-info">{formatAmount(totalSum, currencyISO)}</p>
					<p className="text-white-50">{getSpendsLabel(pagination.totalCount)}</p>

					<ul id={BREAKDOWN_LIST_ID} className="list-unstyled mb-0">
						{
							visibleBreakdown.map(entry => (
								<li key={`${entry.category}-${entry.subcategory}`} className="text-light border-top border-secondary py-2">
									<p className="mb-1">{getFullName(entry.category, entry.subcategory, categories)}</p>
									<div className="d-flex justify-content-between small">
										<span className="text-white-50">{getSpendsLabel(entry.count)}</span>
										<span>{formatAmount(entry.sum, currencyISO)}</span>
									</div>
								</li>
							))
						}
					</ul>

					{
						isBreakdownLong && (
							<button
								type="button"
								className="btn btn-link text-info w-100 border-0 border-top border-secondary rounded-0 search-breakdown-toggle"
								aria-expanded={isBreakdownExpanded}
								aria-controls={BREAKDOWN_LIST_ID}
								onClick={() => setIsBreakdownExpanded(!isBreakdownExpanded)}
							>
								{isBreakdownExpanded ? 'Show less' : 'Show more'}
							</button>
						)
					}
				</div>
			</section>

			<div className="table-responsive">
				<table className="table table-dark table-hover table-sm align-middle">
					<thead>
						<tr className="table-info text-dark">
							<th scope="col" className="text-nowrap">Date</th>
							<th scope="col">Category &amp; subcategory</th>
							<th scope="col" className="text-nowrap">Amount</th>
						</tr>
					</thead>
					<tbody>
						{
							expenses.map(expense => (
								<tr key={expense.uuid}>
									<td className="text-nowrap">{parseUnixTimestamp(expense.date).substring(0, DATE_LENGTH)}</td>
									<td>{getFullName(expense.category, expense.subcategory, categories)}</td>
									<td className="text-nowrap">{formatAmount(expense.quantity, expense.currencyISO)}</td>
								</tr>
							))
						}
					</tbody>
				</table>
			</div>

			<PaginateNavbar currentPage={pagination.currentPage} totalPages={pagination.totalPages} onChangePage={onChangePage} />
		</section>
	)
}

SearchExpensesResults.propTypes = {
	searchResult: PropTypes.shape({
		expenses: PropTypes.arrayOf(
			PropTypes.shape({
				date: PropTypes.string.isRequired,
				uuid: PropTypes.string.isRequired,
				category: PropTypes.string.isRequired,
				subcategory: PropTypes.string,
				quantity: PropTypes.number.isRequired,
				currencyISO: PropTypes.string.isRequired
			})
		).isRequired,
		pagination: PropTypes.shape({
			currentPage: PropTypes.number.isRequired,
			totalPages: PropTypes.number.isRequired,
			totalCount: PropTypes.number.isRequired
		}).isRequired,
		totalSum: PropTypes.number.isRequired,
		currencyISO: PropTypes.string.isRequired,
		breakdown: PropTypes.arrayOf(
			PropTypes.shape({
				category: PropTypes.string.isRequired,
				subcategory: PropTypes.string,
				sum: PropTypes.number.isRequired,
				count: PropTypes.number.isRequired
			})
		).isRequired
	}).isRequired,
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
	).isRequired,
	onChangePage: PropTypes.func.isRequired
}
