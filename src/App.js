import React, { StrictMode, useContext, Suspense } from 'react'

import { Router, Redirect } from '@reach/router'

import { AuthContext } from './AuthContext'

import { Login } from './pages/Login'
import { Registration } from './pages/Registration'
import { Logout } from './pages/Logout'
import { Page404 } from './pages/Page404'

import { NavBar } from './components/NavBar'
import { Footer } from './components/Footer'
import { Spinner } from './components/Spinner'

const Home = React.lazy(() => import('./pages/Home'))
const UserAdministration = React.lazy(() => import('./pages/UserAdministration'))
const MonthlyBalanceAdministration = React.lazy(() => import('./pages/MonthlyBalanceAdministration'))
const InsertMonthlyBalance = React.lazy(() => import('./pages/InsertMonthlyBalance'))
const ViewMonthlyBalance = React.lazy(() => import('./pages/ViewMonthlyBalance'))
const ListExpenseCategories = React.lazy(() => import('./pages/ListExpenseCategories'))
const InsertExpense = React.lazy(() => import('./pages/InsertExpense'))


export const App = () => {
	const { isAuth } = useContext(AuthContext)
	const { userData } = useContext(AuthContext)

	return (
		<StrictMode>
			<div className="container-fluid bg-dark">
				<div className="container">
					<Suspense fallback={<Spinner />}>
						<NavBar />
							<main className="pb-4">
								<Router>
									<Page404 default />
									<Home path='/' />

									{
										// If user is not authenticated...
									}
									{ !isAuth && <Login path='/login' /> }
									{ !isAuth && <Registration path='/register' /> }
									{ !isAuth && <Redirect from='/user-administration' to='/login' noThrow /> }
									{ !isAuth && <Redirect from='/logout' to='/login' noThrow /> }
									{ !isAuth && <Redirect from='/register-monthly-balance' to='/login' noThrow /> }
									{ !isAuth && <Redirect from='/view-monthly-balance' to='/login' noThrow /> }
									{ !isAuth && <Redirect from='/monthly-balance-administration' to='/login' noThrow /> }
									{ !isAuth && <Redirect from='/list-expense-categories' to='/login' noThrow /> }
									{ !isAuth && <Redirect from='/register-expense' to='/login' noThrow /> }
									{ !isAuth && <Login path='/register-expense/:categoryOrSubcategoryId' /> }


									{
										// If user is authenticated...
									}
									{ isAuth && <Redirect from='/login' to='/' noThrow /> }
									{ isAuth && <Redirect from='/register' to='/' noThrow /> }


									{
										// If user is authenticated but don't have administrator role...
									}
									{ isAuth && !userData.isAdmin && <Redirect from='/user-administration' to='/' noThrow /> }


									<InsertMonthlyBalance path='/register-monthly-balance' />
									<ViewMonthlyBalance path='/view-monthly-balance' />
									<MonthlyBalanceAdministration path='/monthly-balance-administration' />

									<UserAdministration path='/user-administration' />

									<ListExpenseCategories path='/list-expense-categories' />
									<ListExpenseCategories path="/register-expense" />
									<InsertExpense path='/register-expense/:categoryOrSubcategoryId' />

									<Logout path='/logout' />

								</Router>
							</main>
						<div className="row pb-5"></div>
						<Footer />
					</Suspense>
				</div>
			</div>
		</StrictMode>
	)
}
