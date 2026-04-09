import PropTypes from 'prop-types'

import { getCategoryTypeText } from '../utils'

// Helper to extract currency from data
const getCurrency = (data) => {
	if (!data || data.length === 0) return null
	return data[0].currencyISO
}

// Helper to calculate total sum
const calculateTotal = (data) => {
	if (!data || data.length === 0) return 0
	return data.reduce((sum, item) => sum + item.sum, 0)
}

export const ViewGetSavingsAndInvestments = ({ data }) => {
	const totalInvested = calculateTotal(data)
	const currency = getCurrency(data)

	return (
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
