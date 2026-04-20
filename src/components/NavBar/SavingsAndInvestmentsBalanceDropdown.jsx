import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { BsBank, BsCashCoin, BsGraphUp, BsListUl, BsPiggyBank } from 'react-icons/bs'

import { useWindowSize } from '../../hooks/useWindowSize'

export const SavingsAndInvestmentsBalanceDropdown = (props) => {
	const size = useWindowSize()
	const largeBreakPoint = 992
	const isDropdownExpanded = size.width <= largeBreakPoint

	return (
		<div className={`dropdown ${ isDropdownExpanded ? 'position-static' : '' }`}>
			<button className="navbar-item btn btn-link text-light font-weight-bold dropdown-toggle p-0 border-0" id="monthly-balance-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				<BsBank size={props.sizeOfPrimaryIcons} title='Cash, savings & investments' />
			</button>
			<div className={`dropdown-menu ${ isDropdownExpanded ? 'w-100' : '' }`} aria-labelledby="monthly-balance-dropdown">
				<span className="dropdown-item-text text-muted">Cash, savings & investments</span>
				<div className="dropdown-divider"></div>
				<Link className="dropdown-item py-3" to='/register-monthly-balance'>
					<BsCashCoin size={props.sizeOfSecondaryIcons} title='Add monthly balance' /><span className="ml-3">Add monthly balance</span>
				</Link>
				<Link className="dropdown-item py-3" to='/view-monthly-balance'>
					<BsGraphUp size={props.sizeOfSecondaryIcons} title='Monthly balance overview'/><span className="ml-3">Monthly balance overview</span>
				</Link>
				<Link className="dropdown-item py-3" to='/monthly-balance-administration'>
					<BsListUl size={props.sizeOfSecondaryIcons} title='Monthly balances list'/><span className="ml-3">Monthly balances list</span>
				</Link>
				<Link className="dropdown-item py-3" to='/savings-and-investments'>
					<BsPiggyBank size={props.sizeOfSecondaryIcons} title='Savings & investments'/><span className="ml-3">Savings & investments</span>
				</Link>
			</div>
		</div>
	)
}

SavingsAndInvestmentsBalanceDropdown.propTypes = {
	sizeOfPrimaryIcons: PropTypes.string.isRequired,
	sizeOfSecondaryIcons: PropTypes.string.isRequired,
}