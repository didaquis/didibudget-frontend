import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { BsCreditCard2Back, BsBarChart, BsListUl, BsCalendarCheck, BsCalendar3 } from 'react-icons/bs'

import { useWindowSize } from '../../hooks/useWindowSize'

export const ExpensesDropdown = (props) => {
	const size = useWindowSize()
	const largeBreakPoint = 992
	const isDropdownExpanded = size.width <= largeBreakPoint

	return (
		<div className={`dropdown ${ isDropdownExpanded ? 'position-static' : '' }`}>
			<button className="navbar-item btn btn-link text-light font-weight-bold dropdown-toggle p-0 border-0" id="expenses-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				<BsCreditCard2Back size={props.sizeOfPrimaryIcons} title='Spending' />
			</button>
			<div className={`dropdown-menu ${ isDropdownExpanded ? 'w-100' : '' }`} aria-labelledby="expenses-dropdown">
				<span className="dropdown-item-text text-muted">Expenses</span>
				<div className="dropdown-divider"></div>
				<Link className="dropdown-item py-3" to='/list-expense-categories'>
					<BsCreditCard2Back size={props.sizeOfSecondaryIcons} title='Add spending'/><span className="ml-3">Add Spending</span>
				</Link>
				<Link className="dropdown-item py-3" to='/view-expenses'>
					<BsBarChart size={props.sizeOfSecondaryIcons} title='Spending overview'/><span className="ml-3">Spending Overview</span>
				</Link>
				<Link className="dropdown-item py-3" to='/expenses-administration'>
					<BsListUl size={props.sizeOfSecondaryIcons} title='Spending list' /><span className="ml-3">Spending List</span>
				</Link>
				<Link className="dropdown-item py-3" to='/monthly-expense-overview'>
					<BsCalendar3 size={props.sizeOfSecondaryIcons} title='Monthly spending overview' /><span className="ml-3">Monthly Spending Overview</span>
				</Link>
				<Link className="dropdown-item py-3" to='/yearly-expense-overview'>
					<BsCalendar3 size={props.sizeOfSecondaryIcons} title='Yearly spending overview' /><span className="ml-3">Yearly Spending Overview</span>
				</Link>
				<Link className="dropdown-item py-3" to='/expenses-analysis'>
					<BsCalendarCheck size={props.sizeOfSecondaryIcons} title='Monthly Spending Breakdown' /><span className="ml-3">Monthly Spending Breakdown</span>
				</Link>
			</div>
		</div>
	)
}

ExpensesDropdown.propTypes = {
	sizeOfPrimaryIcons: PropTypes.string.isRequired,
	sizeOfSecondaryIcons: PropTypes.string.isRequired,
}