import { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Modal } from 'reactstrap'
import {
	BsList, BsXLg,
	BsCartPlus, BsBarChart, BsListUl, BsCalendarEvent, BsCalendarRange, BsCalendar3, BsSearch,
	BsCashCoin, BsGraphUp, BsPiggyBank,
	BsHouse, BsPeople, BsBoxArrowRight
} from 'react-icons/bs'

import { AuthContext } from '../../AuthContext'
import { DidibudgetLogo } from '../DidibudgetLogo'

import './styles.css'

const MENU_ID = 'menu-index'
const MENU_TITLE_ID = 'menu-index-title'
const SIZE_OF_ICONS = 20

const SPENDING = [
	{ to: '/spending/add', label: 'Add spending', Icon: BsCartPlus },
	{ to: '/spending/overview', label: 'Spending overview', Icon: BsBarChart },
	{ to: '/spending/list', label: 'Spending list', Icon: BsListUl },
	{ to: '/spending/this-month', label: 'This month', Icon: BsCalendarEvent },
	{ to: '/spending/last-12-months', label: 'Last 12 months', Icon: BsCalendarRange },
	{ to: '/spending/month-by-month', label: 'Month by month', Icon: BsCalendar3 },
	{ to: '/spending/search', label: 'Spending search', Icon: BsSearch }
]

const CASH_SAVINGS_AND_INVESTMENTS = [
	{ to: '/monthly-balance/add', label: 'Add monthly balance', Icon: BsCashCoin },
	{ to: '/monthly-balance/overview', label: 'Monthly balance overview', Icon: BsGraphUp },
	{ to: '/monthly-balance/list', label: 'Monthly balances list', Icon: BsListUl },
	{ to: '/savings-and-investments', label: 'Savings & investments', Icon: BsPiggyBank }
]

const accountLinks = (isAdmin) => [
	{ to: '/', label: 'Dashboard', Icon: BsHouse },
	...(isAdmin === true ? [{ to: '/users', label: 'User administration', Icon: BsPeople }] : []),
	{ to: '/logout', label: 'Log out', Icon: BsBoxArrowRight }
]

/* Keeps the wordmark and the toggle in the same spot whether the menu is open or closed */
const MenuBar = ({ children, onHome }) => (
	<div className="menu-bar d-flex justify-content-between align-items-center border-bottom border-info">
		<Link className="menu-bar__home" to='/' aria-label='Home' onClick={onHome}>
			<DidibudgetLogo />
		</Link>
		{children}
	</div>
)

const MenuGroup = ({ id, title, links, pathname, onChoose }) => (
	<section>
		<h2 id={id} className="menu-index__title small text-white-50 text-uppercase fw-light">{title}</h2>
		<ul className="list-unstyled mb-0" aria-labelledby={id}>
			{links.map(({ to, label, Icon }) => {
				const isCurrent = pathname === to

				return (
					<li key={to} className="border-bottom border-secondary">
						<Link
							className={`menu-index__link d-flex align-items-center gap-3 text-decoration-none ${isCurrent ? 'text-info' : 'text-light'}`}
							to={to}
							aria-current={isCurrent ? 'page' : undefined}
							onClick={onChoose}
						>
							<Icon size={SIZE_OF_ICONS} className={isCurrent ? 'text-info' : 'text-white-50'} aria-hidden='true' />
							{label}
						</Link>
					</li>
				)
			})}
		</ul>
	</section>
)

export const NavBar = () => {
	const { isAuth, userData } = useContext(AuthContext)
	const { pathname } = useLocation()
	const [isOpen, setIsOpen] = useState(false)

	if (!isAuth) {
		return null
	}

	const close = () => setIsOpen(false)

	return (
		<header className="mt-2 mb-4">
			<MenuBar>
				<button type="button" className="menu-bar__toggle btn btn-link text-info text-decoration-none" aria-expanded={isOpen} aria-controls={MENU_ID} onClick={() => setIsOpen(true)}>
					<BsList size={SIZE_OF_ICONS} aria-hidden='true' /><span className="ms-2">Menu</span>
				</button>
			</MenuBar>

			<Modal
				id={MENU_ID}
				isOpen={isOpen}
				toggle={close}
				fullscreen
				backdrop={false}
				trapFocus
				labelledBy={MENU_TITLE_ID}
				modalClassName="menu-index"
				contentClassName="bg-dark text-light"
				modalTransition={{ timeout: 150 }}
			>
				<div className="container-fluid">
					<div className="container mt-2 pb-5">
						<h1 id={MENU_TITLE_ID} className="visually-hidden">Menu</h1>
						<MenuBar onHome={close}>
							<button type="button" className="menu-bar__toggle btn btn-link text-info text-decoration-none" onClick={close}>
								<BsXLg size={SIZE_OF_ICONS} aria-hidden='true' /><span className="ms-2">Close</span>
							</button>
						</MenuBar>
						<nav aria-label="Main">
							<MenuGroup id="menu-spending" title="Spending" links={SPENDING} pathname={pathname} onChoose={close} />
							<MenuGroup id="menu-balance" title="Cash, savings & investments" links={CASH_SAVINGS_AND_INVESTMENTS} pathname={pathname} onChoose={close} />
							<MenuGroup id="menu-account" title="Account" links={accountLinks(userData.isAdmin)} pathname={pathname} onChoose={close} />
						</nav>
					</div>
				</div>
			</Modal>
		</header>
	)
}
