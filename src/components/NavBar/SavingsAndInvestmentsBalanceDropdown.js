import { Link } from 'react-router-dom'

import { BsBank, BsCashCoin, BsGraphUp, BsListUl, BsPiggyBank } from 'react-icons/bs'


export const SavingsAndInvestmentsBalanceDropdown = () => {
	return (
		<div className="nav-item dropdown">
			<button className="nav-link dropdown-toggle text-light border-0 bg-dark" id="monthly-balance-dropdown" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
				<BsBank size='32px' title='Cash, savings & investments' />
			</button>
			<ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="monthly-balance-dropdown">
				<li><span className="dropdown-item-text text-muted">Cash, savings & investments</span></li>
				<li><hr className="dropdown-divider" /></li>
				<li>
					<Link className="dropdown-item py-3" to='/register-monthly-balance'>
						<BsCashCoin size='24px' title='Add monthly balance' /><span className="ms-3">Add monthly balance</span>
					</Link>
				</li>
				<li>
					<Link className="dropdown-item py-3" to='/view-monthly-balance'>
						<BsGraphUp size='24px' title='Monthly balance overview' /><span className="ms-3">Monthly balance overview</span>
					</Link>
				</li>
				<li>
					<Link className="dropdown-item py-3" to='/monthly-balance-administration'>
						<BsListUl size='24px' title='Monthly balances list' /><span className="ms-3">Monthly balances list</span>
					</Link>
				</li>
				<li>
					<Link className="dropdown-item py-3" to='/savings-and-investments'>
						<BsPiggyBank size='24px' title='Savings & investments' /><span className="ms-3">Savings & investments</span>
					</Link>
				</li>
			</ul>
		</div>
	)
}