import PropTypes from 'prop-types'

import { formatAmount } from '../../../utils/currency'

export const MonthToDateSpending = ({ monthName, spent, savingsAndInvestments, currencyISO }) => (
	<div className="text-light">
		<p className="mb-0 small text-white-50">Spent in {monthName}</p>
		<p className="mb-0 display-5 fw-light text-nowrap">{formatAmount(spent, currencyISO)}</p>
		<p className="mb-0 small text-white-50">Savings & investments in {monthName}: {formatAmount(savingsAndInvestments, currencyISO)}</p>
	</div>
)

MonthToDateSpending.propTypes = {
	monthName: PropTypes.string.isRequired,
	spent: PropTypes.number.isRequired,
	savingsAndInvestments: PropTypes.number.isRequired,
	currencyISO: PropTypes.string.isRequired,
}
