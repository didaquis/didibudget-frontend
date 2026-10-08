import { useMutation } from '@apollo/client'
import PropTypes from 'prop-types'

import { parseUnixTimestamp } from '../../../utils/utils'
import { getNameOfCategoryOrSubcategory } from '../utils'

import { EmptyState } from '../../EmptyState'
import { ButtonDelete } from '../../ButtonDelete'
import { PaginateNavbar } from '../../PaginateNavbar'

import { DELETE_EXPENSE } from '../../../gql/mutations/expenses'
import { formatAmount } from '../../../utils/currency'

export const ListOfExpenses = ( { expenses, paginationData, categories, refetch, onChangePage } ) => {

	const [ deleteExpense ] = useMutation(DELETE_EXPENSE)

	const onDeleteExpense = () => {
		const isUniqueResultOnCurrentPage = expenses.length === 1
		const isNotFirstPage = paginationData.currentPage !== 1
		const isLastPage = paginationData.currentPage === paginationData.totalPages

		const isNecessaryRequestThePreviousPage = isUniqueResultOnCurrentPage && isNotFirstPage && isLastPage

		if (!isNecessaryRequestThePreviousPage) {
			refetch()
		} else {
			const previousPage = paginationData.currentPage - 1
			onChangePage(previousPage)
		}
	}

	if (expenses.length) {
		const rows = expenses.map(expense => {
			const nameOfCategory = getNameOfCategoryOrSubcategory(expense.category, categories)
			const nameOfSubcategory = getNameOfCategoryOrSubcategory(expense.subcategory, categories)
			const date = parseUnixTimestamp(expense.date).substring(0, 10)
			const fullNameOfCategory = `${nameOfCategory}${(nameOfSubcategory) ? ` › ${nameOfSubcategory}` : ''}`
			const amount = formatAmount(expense.quantity, expense.currencyISO)
			return { uuid: expense.uuid, date, fullNameOfCategory, amount, details: [date, fullNameOfCategory, amount] }
		})

		return (
			<section>
				<div className="d-none d-md-block table-responsive">
					<table className="table table-dark table-hover">
						<thead>
							<tr className="table-info text-dark">
								<th scope="col">Date</th>
								<th scope="col">Category & subcategory</th>
								<th scope="col">Amount</th>
								<th scope="col">Actions</th>
							</tr>
						</thead>
						<tbody>
							{
								rows.map(row => (
									<tr key={row.uuid}>
										<td className="text-nowrap">{row.date}</td>
										<td>{row.fullNameOfCategory}</td>
										<td className="text-nowrap">{row.amount}</td>
										<td>
											<ButtonDelete uuid={row.uuid} details={row.details} deleteMutation={deleteExpense} onDelete={onDeleteExpense} />
										</td>
									</tr>
								))
							}
						</tbody>
					</table>
				</div>

				{
					// Below 768px a four-column table can't fit a whole date, so each spend stacks instead
				}
				<ul className="d-md-none list-group list-group-flush">
					{
						rows.map(row => (
							<li className="list-group-item bg-dark text-light border-secondary px-0 py-3" key={row.uuid}>
								<div className="d-flex align-items-center gap-3">
									<div className="flex-grow-1">
										<p className="mb-0">{row.fullNameOfCategory}</p>
										<p className="mb-0 small text-white-50">
											<span className="text-nowrap">{row.date}</span> · <span className="text-nowrap text-light">{row.amount}</span>
										</p>
									</div>
									<ButtonDelete uuid={row.uuid} details={row.details} deleteMutation={deleteExpense} onDelete={onDeleteExpense} />
								</div>
							</li>
						))
					}
				</ul>

				<PaginateNavbar currentPage={paginationData.currentPage} totalPages={paginationData.totalPages} onChangePage={onChangePage} />
			</section>
		)
	} else {
		const message = 'No spending recorded yet. Add your first spend to see the list.'
		return <EmptyState message={message} />
	}
}


ListOfExpenses.propTypes = {
	expenses: PropTypes.arrayOf(
		PropTypes.shape({
			date: PropTypes.string.isRequired,
			uuid: PropTypes.string.isRequired,
			category: PropTypes.string.isRequired,
			subcategory: PropTypes.string,
			quantity: PropTypes.number.isRequired,
			currencyISO: PropTypes.string.isRequired
		})
	),
	paginationData: PropTypes.shape({
		currentPage: PropTypes.number.isRequired,
		totalPages: PropTypes.number.isRequired,
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
	refetch: PropTypes.func.isRequired,
	onChangePage: PropTypes.func.isRequired
}
