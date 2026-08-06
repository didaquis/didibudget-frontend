import { useMutation } from '@apollo/client'
import PropTypes from 'prop-types'

import { parseUnixTimestamp } from '../../../utils/utils'
import { getNameOfCategoryOrSubcategory } from '../utils'

import { EmptyState } from '../../EmptyState'
import { ButtonDelete } from '../../ButtonDelete'
import { PaginateNavbar } from '../../PaginateNavbar'

import { DELETE_EXPENSE } from '../../../gql/mutations/expenses'

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
		return (
			<section className="table-responsive">
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
							expenses.map(expense => {
								const nameOfCategory = getNameOfCategoryOrSubcategory(expense.category, categories)
								const nameOfSubcategory = getNameOfCategoryOrSubcategory(expense.subcategory, categories)
								const date = parseUnixTimestamp(expense.date).substring(0, 10)
								const fullNameOfCategory = `${nameOfCategory}${(nameOfSubcategory) ? ` - ${nameOfSubcategory}` : ''}`
								const details = [date, fullNameOfCategory, `${expense.quantity} ${expense.currencyISO}`]
								return (
									<tr key={expense.uuid}>
										<td>{date}</td>
										<td>{fullNameOfCategory}</td>
										<td>{expense.quantity} {expense.currencyISO}</td>
										<td>
											<ButtonDelete uuid={expense.uuid} details={details} deleteMutation={deleteExpense} onDelete={onDeleteExpense} />
										</td>
									</tr>
								)
							})
						}
					</tbody>
				</table>

				<PaginateNavbar currentPage={paginationData.currentPage} totalPages={paginationData.totalPages} onChangePage={onChangePage} />
			</section>
		)
	} else {
		const message = 'No expenses recorded yet. Add your first one to see the list'
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
