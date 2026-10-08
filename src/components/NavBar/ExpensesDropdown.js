import { Link } from 'react-router'

import { BsCreditCard2Back, BsCartPlus, BsBarChart, BsListUl, BsCalendarMonth, BsCalendarRange, BsCalendar3, BsSearch } from 'react-icons/bs'


export const ExpensesDropdown = () => {
	return (
		<div className="nav-item dropdown">
			<button className="nav-link dropdown-toggle text-light border-0 bg-dark" id="expenses-dropdown" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Spending">
				<BsCreditCard2Back size='32px' aria-hidden='true' />
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
					<Link className="dropdown-item py-3" to='/spending/this-month'>
						<BsCalendarMonth size='24px' aria-hidden='true' /><span className="ms-3">This month</span>
					</Link>
				</li>
				<li>
					<Link className="dropdown-item py-3" to='/spending/last-12-months'>
						<BsCalendarRange size='24px' aria-hidden='true' /><span className="ms-3">Last 12 months</span>
					</Link>
				</li>
				<li>
					<Link className="dropdown-item py-3" to='/spending/month-by-month'>
						<BsCalendar3 size='24px' aria-hidden='true' /><span className="ms-3">Month by month</span>
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