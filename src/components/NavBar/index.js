import React, { useContext } from 'react'
import { Link } from '@reach/router'

import { MdHome, MdPeopleOutline } from 'react-icons/md'
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { FaPiggyBank } from "react-icons/fa";

import { AuthContext } from '../../AuthContext'

const SIZE = '36px'

export const NavBar = () => {
	const { isAuth } = useContext(AuthContext)
	const { userData } = useContext(AuthContext)

	return (
		<nav className="navbar navbar-expand-lg navbar-dark justify-content-between d-flex mb-5 border-bottom border-info">
			<Link className="navbar-brand text-light font-weight-bold pt-2" to='/'>
				<MdHome size={SIZE}/>
			</Link>
			{ 
				isAuth && <Link className="navbar-item text-light font-weight-bold pt-2" to='/register-monthly-balance'>
					<FaPiggyBank size={SIZE}/>
				</Link>
			}
			{ 
				isAuth && userData.isAdmin && <Link className="navbar-item text-light font-weight-bold pt-2" to='/user-administration'>
					<MdPeopleOutline size={SIZE}/>
				</Link>
			}
			<Link className="navbar-item text-light font-weight-bold pt-2" to='/logout'>
				{ !isAuth && <IoMdLogIn size={SIZE}/> }
				{ isAuth && <IoMdLogOut size={SIZE}/> }
			</Link>
		</nav>
	)
}