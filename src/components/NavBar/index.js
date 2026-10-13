import { useContext } from 'react'
import { Link } from 'react-router'
import { BsHouse, BsPeople, BsBoxArrowRight } from 'react-icons/bs'

import { AuthContext } from '../../AuthContext'

import { SavingsAndInvestmentsBalanceDropdown } from './SavingsAndInvestmentsBalanceDropdown'
import { ExpensesDropdown } from './ExpensesDropdown'

const SIZE_OF_PRIMARY_ICONS = '32px'


export const NavBar = () => {
	const { isAuth, userData } = useContext(AuthContext)

	if (!isAuth) {
		return null
	}

	return (
		<nav className="nav navbar-dark justify-content-between flex-nowrap border-bottom border-info mt-2 mb-4">
			<div className="nav-item">
				<Link className="nav-link text-light" to='/' aria-label='Home'>
					<BsHouse size={SIZE_OF_PRIMARY_ICONS} aria-hidden='true' />
				</Link>
			</div>

			<SavingsAndInvestmentsBalanceDropdown />

			<ExpensesDropdown />

			{userData.isAdmin && (
				<div className="nav-item">
					<Link className="nav-link text-light" to='/users' aria-label='User administration'>
						<BsPeople size={SIZE_OF_PRIMARY_ICONS} aria-hidden='true' />
					</Link>
				</div>
			)}

			<div className="nav-item">
				<Link className="nav-link text-light" to='/logout' aria-label='Log out'>
					<BsBoxArrowRight size={SIZE_OF_PRIMARY_ICONS} aria-hidden='true' />
				</Link>
			</div>
		</nav>
	)
}