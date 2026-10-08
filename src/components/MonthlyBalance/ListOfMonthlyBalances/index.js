import { useMutation } from '@apollo/client'
import PropTypes from 'prop-types'

import { formatMonth } from '../../../utils/months'

import { EmptyState } from '../../EmptyState'
import { ButtonDelete } from '../../ButtonDelete'
import { PaginateNavbar } from '../../PaginateNavbar'

import { DELETE_MONTHLY_BALANCE } from '../../../gql/mutations/monthlyBalances'
import { formatAmount } from '../../../utils/currency'

export const ListOfMonthlyBalances = ({ monthlyBalances, paginationData, refetch, onChangePage }) => {

	const [deleteMonthlyBalance] = useMutation(DELETE_MONTHLY_BALANCE)

	const onDeleteMonthlyBalance = () => {
		const isUniqueResultOnCurrentPage = monthlyBalances.length === 1
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

	if (monthlyBalances.length) {
		const rows = monthlyBalances.map(monthlyBalance => {
			const monthLabel = formatMonth(monthlyBalance)
			const balance = formatAmount(monthlyBalance.balance, monthlyBalance.currencyISO)
			return { uuid: monthlyBalance.uuid, monthLabel, balance, details: [monthLabel, balance] }
		})

		return (
			<section>
				<div className="d-none d-md-block table-responsive">
					<table className="table table-dark table-hover">
						<thead>
							<tr className="table-info text-dark">
								<th scope="col">Month</th>
								<th scope="col">Balance</th>
								<th scope="col">Actions</th>
							</tr>
						</thead>
						<tbody>
							{
								rows.map(row => (
									<tr key={row.uuid}>
										<td className="text-nowrap">{row.monthLabel}</td>
										<td className="text-nowrap">{row.balance}</td>
										<td>
											<ButtonDelete uuid={row.uuid} details={row.details} deleteMutation={deleteMonthlyBalance} onDelete={onDeleteMonthlyBalance} />
										</td>
									</tr>
								))
							}
						</tbody>
					</table>
				</div>

				<ul className="d-md-none list-group list-group-flush">
					{
						rows.map(row => (
							<li className="list-group-item bg-dark text-light border-secondary px-0 py-3" key={row.uuid}>
								<div className="d-flex align-items-center gap-3">
									<div className="flex-grow-1">
										<p className="mb-0">{row.monthLabel}</p>
										<p className="mb-0 small text-nowrap">{row.balance}</p>
									</div>
									<ButtonDelete uuid={row.uuid} details={row.details} deleteMutation={deleteMonthlyBalance} onDelete={onDeleteMonthlyBalance} />
								</div>
							</li>
						))
					}
				</ul>

				<PaginateNavbar currentPage={paginationData.currentPage} totalPages={paginationData.totalPages} onChangePage={onChangePage} />
			</section>
		)
	} else {
		const message = 'No monthly balances recorded yet. Add your first one to see the list.'
		return <EmptyState message={message} />
	}
}


ListOfMonthlyBalances.propTypes = {
	monthlyBalances: PropTypes.arrayOf(
		PropTypes.shape({
			year: PropTypes.number.isRequired,
			month: PropTypes.string.isRequired,
			uuid: PropTypes.string.isRequired,
			balance: PropTypes.number.isRequired,
			currencyISO: PropTypes.string.isRequired
		})
	),
	paginationData: PropTypes.shape({
		currentPage: PropTypes.number.isRequired,
		totalPages: PropTypes.number.isRequired,
	}),
	refetch: PropTypes.func.isRequired,
	onChangePage: PropTypes.func.isRequired
}
