import { Link } from 'react-router'
import PropTypes from 'prop-types'
import { BsChevronRight } from 'react-icons/bs'

import { formatAmount } from '../../../utils/currency'

export const MonthToDateSpending = ({ monthName, spent, savingsAndInvestments, currencyISO }) => (
	<Link className="d-block text-decoration-none text-light" to='/spending/monthly'>
		<span className="d-block small text-white-50">Spent in {monthName}</span>
		<span className="d-flex justify-content-between align-items-center">
			<span className="display-5 fw-light text-nowrap">{formatAmount(spent, currencyISO)}</span>
			<BsChevronRight className="text-info flex-shrink-0" size={24} aria-hidden="true" />
		</span>
		<span className="d-block small text-white-50">Savings & investments in {monthName}: {formatAmount(savingsAndInvestments, currencyISO)}</span>
	</Link>
)

MonthToDateSpending.propTypes = {
	monthName: PropTypes.string.isRequired,
	spent: PropTypes.number.isRequired,
	savingsAndInvestments: PropTypes.number.isRequired,
	currencyISO: PropTypes.string.isRequired,
}
