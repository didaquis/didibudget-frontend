import { Link } from 'react-router'

import { BsCreditCard2Back, BsCartPlus, BsBarChart, BsListUl, BsCalendarCheck, BsCalendar3, BsSearch } from 'react-icons/bs'


export const ExpensesDropdown = () => {
	return (
		<div className="nav-item dropdown">
			<button className="nav-link dropdown-toggle text-light border-0 bg-dark" id="expenses-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
				<BsCreditCard2Back size='32px' title='Spending' />
			</button>
			<ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="expenses-dropdown">
				<li><span className="dropdown-item-text text-light">Spending</span></li>
				<li><hr className="dropdown-divider" /></li>
				<li>
					<Link className="dropdown-item py-3" to='/spending/add'>
						<BsCartPlus size='24px' aria-hidden='true' /><span className="ms-3">Add spending</span>
					</Link>
				</li>
				<li>
					<Link className="dropdown-item py-3" to='/spending/overview'>
						<BsBarChart size='24px' aria-hidden='true' /><span className="ms-3">Spending overview</span>
					</Link>
				</li>
				<li>
					<Link className="dropdown-item py-3" to='/spending/list'>
						<BsListUl size='24px' aria-hidden='true' /><span className="ms-3">Spending list</span>
					</Link>
				</li>
				<li>
					<Link className="dropdown-item py-3" to='/spending/monthly'>
						<BsCalendar3 size='24px' aria-hidden='true' /><span className="ms-3">Monthly spending overview</span>
					</Link>
				</li>
				<li>
					<Link className="dropdown-item py-3" to='/spending/yearly'>
						<BsCalendar3 size='24px' aria-hidden='true' /><span className="ms-3">Yearly spending overview</span>
					</Link>
				</li>
				<li>
					<Link className="dropdown-item py-3" to='/spending/monthly-breakdown'>
						<BsCalendarCheck size='24px' aria-hidden='true' /><span className="ms-3">Monthly spending breakdown</span>
					</Link>
				</li>
				<li>
					<Link className="dropdown-item py-3" to='/spending/search'>
						<BsSearch size='24px' aria-hidden='true' /><span className="ms-3">Spending search</span>
					</Link>
				</li>
			</ul>
		</div>
	)
}