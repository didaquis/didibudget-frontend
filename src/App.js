import { StrictMode, lazy } from 'react'

import { Routes, Route } from 'react-router'
import Localization from 'react-widgets/Localization'

import { Login } from './pages/Login'
import { Registration } from './pages/Registration'
import { Logout } from './pages/Logout'
import { Page404 } from './pages/Page404'

import { NavBar } from './components/NavBar'
import { Footer } from './components/Footer'
import { LazyRoute } from './components/LazyRoute'
import { RequireAuth } from './components/RequireAuth'
import { RequireUnauthenticated } from './components/RequireUnauthenticated'
import { RequireAdminRole } from './components/RequireAdminRole'
import { dateLocalizer } from './utils/dateLocalizer'

const Home = lazy(() => import('./pages/Home'))
const UserAdministration = lazy(() => import('./pages/Users/UserAdministration'))
const InsertMonthlyBalance = lazy(() => import('./pages/MonthlyBalance/InsertMonthlyBalance'))
const ViewMonthlyBalance = lazy(() => import('./pages/MonthlyBalance/ViewMonthlyBalance'))
const MonthlyBalanceAdministration = lazy(() => import('./pages/MonthlyBalance/MonthlyBalanceAdministration'))
const SavingsAndInvestments = lazy(() => import('./pages/SavingsAndInvestments/SavingsAndInvestments'))
const AddExpense = lazy(() => import('./pages/Expenses/AddExpense'))
const ViewExpenses = lazy(() => import('./pages/Expenses/ViewExpenses'))
const ExpenseAdministration = lazy(() => import('./pages/Expenses/ExpenseAdministration'))
const ExpenseAnalysis = lazy(() => import('./pages/Expenses/ExpenseAnalysis'))
const YearlyExpenseOverview = lazy(() => import('./pages/Expenses/YearlyExpenseOverview'))
const MonthlyExpenseOverview = lazy(() => import('./pages/Expenses/MonthlyExpenseOverview'))
const SearchExpenses = lazy(() => import('./pages/Expenses/SearchExpenses'))


export const App = () => {
	return (
		<Localization date={dateLocalizer}>
		<StrictMode>
			<div className="container-fluid bg-dark">
				<div className="container">
					<NavBar />
						<main className="pb-4">
							<Routes>
								<Route path='/' element={
									<LazyRoute>
										<Home />
									</LazyRoute>
								} />
								<Route path='*' element={<Page404 />} />

								{
									// Restricted routes for non-authenticated users
								}
								<Route path='/login' element={
									<RequireUnauthenticated>
										<Login />
									</RequireUnauthenticated>
								} />
								<Route path='/register' element={
									<RequireUnauthenticated>
										<Registration />
									</RequireUnauthenticated>
								} />

								{
									// Restricted routes for authenticated users
								}
								<Route path='/monthly-balance/add' element={
									<RequireAuth>
										<LazyRoute>
											<InsertMonthlyBalance />
										</LazyRoute>
									</RequireAuth>
								} />
								<Route path='/monthly-balance/overview' element={
									<RequireAuth>
										<LazyRoute>
											<ViewMonthlyBalance />
										</LazyRoute>
									</RequireAuth>
								} />
								<Route path='/monthly-balance/list' element={
									<RequireAuth>
										<LazyRoute>
											<MonthlyBalanceAdministration />
										</LazyRoute>
									</RequireAuth>
								} />
								<Route path='/savings-and-investments' element={
									<RequireAuth>
										<LazyRoute>
											<SavingsAndInvestments />
										</LazyRoute>
									</RequireAuth>
								} />
								<Route path='/spending/add' element={
									<RequireAuth>
										<LazyRoute>
											<AddExpense />
										</LazyRoute>
									</RequireAuth>
								} />
								<Route path='/spending/overview' element={
									<RequireAuth>
										<LazyRoute>
											<ViewExpenses />
										</LazyRoute>
									</RequireAuth>
								} />
								<Route path='/spending/list' element={
									<RequireAuth>
										<LazyRoute>
											<ExpenseAdministration />
										</LazyRoute>
									</RequireAuth>
								} />
								<Route path='/spending/monthly-breakdown' element={
									<RequireAuth>
										<LazyRoute>
											<ExpenseAnalysis />
										</LazyRoute>
									</RequireAuth>
								} />
								<Route path='/spending/monthly' element={
									<RequireAuth>
										<LazyRoute>
											<MonthlyExpenseOverview />
										</LazyRoute>
									</RequireAuth>
								} />
								<Route path='/spending/yearly' element={
									<RequireAuth>
										<LazyRoute>
											<YearlyExpenseOverview />
										</LazyRoute>
									</RequireAuth>
								} />
								<Route path='/spending/search' element={
									<RequireAuth>
										<LazyRoute>
											<SearchExpenses />
										</LazyRoute>
									</RequireAuth>
								} />
								<Route path='/logout' element={
									<RequireAuth>
										<Logout />
									</RequireAuth>
								} />

								{
									// Restricted routes for authenticated administrator users
								}
								<Route path='/users' element={
									<RequireAuth>
										<RequireAdminRole>
											<LazyRoute>
												<UserAdministration />
											</LazyRoute>
										</RequireAdminRole>
									</RequireAuth>
								} />
							</Routes>
						</main>
					<div className="row pb-5"></div>
					<Footer />
				</div>
			</div>
		</StrictMode>
		</Localization>
	)
}
