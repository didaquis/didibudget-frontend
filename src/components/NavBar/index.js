import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { BsHouse, BsPeople, BsBoxArrowInRight, BsBoxArrowRight } from 'react-icons/bs'

import { AuthContext } from '../../AuthContext'

import { SavingsAndInvestmentsBalanceDropdown } from './SavingsAndInvestmentsBalanceDropdown'
import { ExpensesDropdown } from './ExpensesDropdown'

const SIZE_OF_PRIMARY_ICONS = '32px'
const SIZE_OF_SECONDARY_ICONS = '24px'


export const NavBar = () => {
	const { isAuth, userData } = useContext(AuthContext)

	return (
		<nav className="navbar navbar-expand-lg navbar-dark justify-content-between d-flex border-bottom border-info mt-2 mb-5">
			<Link className="navbar-item text-light font-weight-bold" to='/'>
				<BsHouse size={SIZE_OF_PRIMARY_ICONS} title='Home' />
			</Link>

			{
				isAuth && <SavingsAndInvestmentsBalanceDropdown sizeOfPrimaryIcons={SIZE_OF_PRIMARY_ICONS} sizeOfSecondaryIcons={SIZE_OF_SECONDARY_ICONS} />
			}

			{
				isAuth && <ExpensesDropdown sizeOfPrimaryIcons={SIZE_OF_PRIMARY_ICONS} sizeOfSecondaryIcons={SIZE_OF_SECONDARY_ICONS} />
			}

			{ 
				isAuth && userData.isAdmin && <Link className="navbar-item text-light font-weight-bold" to='/user-administration'>
					<BsPeople size={SIZE_OF_PRIMARY_ICONS} title='User administration'/>
				</Link>
			}
			<Link className="navbar-item text-light font-weight-bold" to={isAuth ? '/logout' : '/login'}>
				{ !isAuth && <BsBoxArrowInRight size={SIZE_OF_PRIMARY_ICONS} title='Login' /> }
				{ isAuth && <BsBoxArrowRight size={SIZE_OF_PRIMARY_ICONS} title='Logout' /> }
			</Link>
		</nav>
	)
}