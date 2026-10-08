import PropTypes from 'prop-types'

import { formatAmount } from '../../../utils/currency'

const MonthFigures = ({ monthName, spent, savingsAndInvestments, children, className = '' }) => (
	<div className={`text-light ${className}`}>
		<p className="mb-0 small text-white-50">Spent in {monthName}</p>
		<p className="mb-0 display-5 fw-light text-nowrap">{spent}</p>
		<p className="mb-0 small text-white-50">Savings & investments: {savingsAndInvestments}</p>
		{children}
	</div>
)

MonthFigures.propTypes = {
	monthName: PropTypes.string.isRequired,
	spent: PropTypes.node.isRequired,
	savingsAndInvestments: PropTypes.node.isRequired,
	children: PropTypes.node,
	className: PropTypes.string,
}

export const MonthToDateSpending = ({ monthName, spent, savingsAndInvestments, currencyISO }) => (
	<MonthFigures
		monthName={monthName}
		spent={formatAmount(spent, currencyISO)}
		savingsAndInvestments={formatAmount(savingsAndInvestments, currencyISO)}
	/>
)

MonthToDateSpending.propTypes = {
	monthName: PropTypes.string.isRequired,
	spent: PropTypes.number.isRequired,
	savingsAndInvestments: PropTypes.number.isRequired,
	currencyISO: PropTypes.string.isRequired,
}

// Same lines as the loaded figures, so nothing below moves when the data arrives
export const MonthToDateSpendingLoading = ({ monthName }) => (
	<MonthFigures
		className="placeholder-glow"
		monthName={monthName}
		spent={<span className="placeholder col-4" aria-hidden="true" />}
		savingsAndInvestments={<span className="placeholder col-2" aria-hidden="true" />}
	>
		<span className="visually-hidden" role="status">Loading this month…</span>
	</MonthFigures>
)

MonthToDateSpendingLoading.propTypes = {
	monthName: PropTypes.string.isRequired,
}
