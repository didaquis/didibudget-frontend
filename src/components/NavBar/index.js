import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { BsHouse, BsPeople, BsBoxArrowInRight, BsBoxArrowRight } from 'react-icons/bs'

import { AuthContext } from '../../AuthContext'

import { SavingsAndInvestmentsBalanceDropdown } from './SavingsAndInvestmentsBalanceDropdown'
import { ExpensesDropdown } from './ExpensesDropdown'

const SIZE_OF_PRIMARY_ICONS = '32px'


export const NavBar = () => {
	const { isAuth, userData } = useContext(AuthContext)

	return (
		<nav className="nav navbar-dark justify-content-between border-bottom border-info mt-2 mb-5">
			<div className="nav-item">
				<Link className="nav-link text-light" to='/'>
					<BsHouse size={SIZE_OF_PRIMARY_ICONS} title='Home' />
				</Link>
			</div>

			{isAuth && (
				<SavingsAndInvestmentsBalanceDropdown />
			)}

			{isAuth && (
				<ExpensesDropdown />
			)}

			{isAuth && userData.isAdmin && (
				<div className="nav-item">
					<Link className="nav-link text-light" to='/user-administration'>
						<BsPeople size={SIZE_OF_PRIMARY_ICONS} title='User administration' />
					</Link>
				</div>
			)}

			<div className="nav-item">
				<Link className="nav-link text-light" to={isAuth ? '/logout' : '/login'}>
					{!isAuth && <BsBoxArrowInRight size={SIZE_OF_PRIMARY_ICONS} title='Login' />}
					{isAuth && <BsBoxArrowRight size={SIZE_OF_PRIMARY_ICONS} title='Logout' />}
				</Link>
			</div>
		</nav>
	)
}