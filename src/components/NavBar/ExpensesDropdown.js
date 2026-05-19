import { Link } from 'react-router-dom'

import { BsCreditCard2Back, BsCartPlus, BsBarChart, BsListUl, BsCalendarCheck, BsCalendar3 } from 'react-icons/bs'


export const ExpensesDropdown = () => {
	return (
		<div className="nav-item dropdown">
			<button className="nav-link dropdown-toggle text-light border-0 bg-dark" id="expenses-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
				<BsCreditCard2Back size='32px' title='Spendings' />
			</button>
			<ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="expenses-dropdown">
				<li><span className="dropdown-item-text text-muted">Spendings</span></li>
				<li><hr className="dropdown-divider" /></li>
				<li>
					<Link className="dropdown-item py-3" to='/list-expense-categories'>
						<BsCartPlus size='24px' title='Add spending' /><span className="ms-3">Add spending</span>
					</Link>
				</li>
				<li>
					<Link className="dropdown-item py-3" to='/view-expenses'>
						<BsBarChart size='24px' title='Spending overview' /><span className="ms-3">Spending overview</span>
					</Link>
				</li>
				<li>
					<Link className="dropdown-item py-3" to='/expenses-administration'>
						<BsListUl size='24px' title='Spending list' /><span className="ms-3">Spending list</span>
					</Link>
				</li>
				<li>
					<Link className="dropdown-item py-3" to='/monthly-expense-overview'>
						<BsCalendar3 size='24px' title='Monthly spending overview' /><span className="ms-3">Monthly spending overview</span>
					</Link>
				</li>
				<li>
					<Link className="dropdown-item py-3" to='/yearly-expense-overview'>
						<BsCalendar3 size='24px' title='Yearly spending overview' /><span className="ms-3">Yearly spending overview</span>
					</Link>
				</li>
				<li>
					<Link className="dropdown-item py-3" to='/expenses-analysis'>
						<BsCalendarCheck size='24px' title='Monthly spending breakdown' /><span className="ms-3">Monthly spending breakdown</span>
					</Link>
				</li>
			</ul>
		</div>
	)
}