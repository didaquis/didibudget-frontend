import PropTypes from 'prop-types'

import { parseUnixTimestamp } from '../../../utils/utils'
import { getNameOfCategoryOrSubcategory } from '../utils'

import { ErrorAlert } from '../../ErrorAlert'
import { PaginateNavbar } from '../../PaginateNavbar'

const DATE_LENGTH = 10

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
 * Get a number of expenses with its noun, so the figure is never displayed unlabelled
 * @example
 * 	getExpensesLabel(1) // '1 expense'
 * @param {number} count
 * @returns {string}
 */
const getExpensesLabel = (count) => `${count} ${(count === 1) ? 'expense' : 'expenses'}`

export const SearchExpensesResults = ({ searchResult, categories, onChangePage }) => {
	const { expenses, pagination, totalSum, currencyISO, breakdown } = searchResult

	if (!expenses.length) {
		return <ErrorAlert errorMessage='No expenses found' />
	}

	return (
		<section>
			<section className="card bg-dark border-info mb-4" aria-label="Search summary">
				<div className="card-body">
					<p className="text-muted mb-1">Total spent</p>
					<p className="h3 text-info">{totalSum} {currencyISO}</p>
					<p className="text-muted">{getExpensesLabel(pagination.totalCount)}</p>

					<ul className="list-unstyled mb-0">
						{
							breakdown.map(entry => (
								<li key={`${entry.category}-${entry.subcategory}`} className="text-light border-top border-secondary py-2">
									<p className="mb-1">{getFullName(entry.category, entry.subcategory, categories)}</p>
									<div className="d-flex justify-content-between small">
										<span className="text-muted">{getExpensesLabel(entry.count)}</span>
										<span>{entry.sum} {currencyISO}</span>
									</div>
								</li>
							))
						}
					</ul>
				</div>
			</section>

			<div className="table-responsive">
				<table className="table table-dark table-hover table-sm align-middle">
					<thead>
						<tr className="table-info text-dark">
							<th scope="col" className="text-nowrap">Date</th>
							<th scope="col">Category &amp; subcategory</th>
							<th scope="col" className="text-nowrap">Quantity</th>
						</tr>
					</thead>
					<tbody>
						{
							expenses.map(expense => (
								<tr key={expense.uuid}>
									<td className="text-nowrap">{parseUnixTimestamp(expense.date).substring(0, DATE_LENGTH)}</td>
									<td>{getFullName(expense.category, expense.subcategory, categories)}</td>
									<td className="text-nowrap">{expense.quantity} {expense.currencyISO}</td>
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
