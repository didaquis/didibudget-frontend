import { Fragment } from 'react'
import PropTypes from 'prop-types'

import { getCategoryTypeText } from '../utils'

export const ViewGetSavingsAndInvestments = ({ data }) => {
	return (
		<Fragment>
			<section className="table-responsive">
				<table className="table table-dark table-hover">
					<thead>
						<tr className="table-info text-dark">
							<th scope="col">Product</th>
							<th scope="col">Total invested</th>
						</tr>
					</thead>
					<tbody>
						{
							data.map(expenseSum => {
								return (
									<tr key={expenseSum.categoryType}>
										<td>{ getCategoryTypeText(expenseSum.categoryType) }</td>
										<td>{expenseSum.sum} {expenseSum.currencyISO}</td>
									</tr>
								)
							})
						}
					</tbody>
				</table>
			</section>
		</Fragment>
	)
}

ViewGetSavingsAndInvestments.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			categoryType: PropTypes.string.isRequired,
			sum: PropTypes.number.isRequired,
			currencyISO: PropTypes.string.isRequired
		})
	).isRequired,
}
