import { useState } from 'react'
import PropTypes from 'prop-types'

import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import { DatePicker } from 'react-widgets'
import { Collapse } from 'reactstrap'
import 'react-widgets/dist/css/react-widgets.css'

Moment.locale('en', {
	week: {
		dow: 1 // Monday is the first day of the week.
	}
})
momentLocalizer()

const INITIAL_FILTERS = {
	category: '',
	subcategory: '',
	startDate: null,
	endDate: null,
	minQuantity: '',
	maxQuantity: '',
	sortBy: 'date',
	sortDirection: 'desc'
}

const SELECT_CLASS_NAME = 'form-select bg-dark text-light border-secondary'
const INPUT_CLASS_NAME = 'form-control bg-dark text-light border-secondary'

export const SearchExpensesFilters = ({ categories, onSearch }) => {
	const [filters, setFilters] = useState(INITIAL_FILTERS)
	const [isOpen, setIsOpen] = useState(true)

	const selectedCategory = categories.find(category => category._id === filters.category)
	const subcategories = selectedCategory ? selectedCategory.subcategories : []

	const onChangeCategory = (event) => {
		setFilters({ ...filters, category: event.target.value, subcategory: '' })
	}

	const onChangeField = (field) => (event) => {
		setFilters({ ...filters, [field]: event.target.value })
	}

	const onChangeDate = (field) => (date) => {
		setFilters({ ...filters, [field]: date })
	}

	const onSubmit = (event) => {
		event.preventDefault()
		setIsOpen(false)
		onSearch(filters)
	}

	return (
		<section className="mb-4">
			<button
				type="button"
				className="btn btn-outline-info w-100 mb-2"
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen}
			>
				Filters
			</button>

			<Collapse isOpen={isOpen}>
				<form onSubmit={onSubmit} className="card bg-dark border-secondary p-3">
					<div className="mb-3">
						<label className="form-label text-muted" htmlFor="category">Category</label>
						<select id="category" className={SELECT_CLASS_NAME} value={filters.category} onChange={onChangeCategory}>
							<option value="">All categories</option>
							{
								categories.map(category => (
									<option key={category._id} value={category._id}>{category.name}</option>
								))
							}
						</select>
					</div>

					<div className="mb-3">
						<label className="form-label text-muted" htmlFor="subcategory">Subcategory</label>
						<select id="subcategory" className={SELECT_CLASS_NAME} value={filters.subcategory} onChange={onChangeField('subcategory')} disabled={!subcategories.length}>
							<option value="">All subcategories</option>
							{
								subcategories.map(subcategory => (
									<option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
								))
							}
						</select>
					</div>

					<div className="row">
						<div className="col-6 mb-3">
							<label className="form-label text-muted" htmlFor="startDate">From</label>
							<DatePicker id="startDate" value={filters.startDate} onChange={onChangeDate('startDate')} />
						</div>
						<div className="col-6 mb-3">
							<label className="form-label text-muted" htmlFor="endDate">To</label>
							<DatePicker id="endDate" value={filters.endDate} onChange={onChangeDate('endDate')} />
						</div>
					</div>

					<div className="row">
						<div className="col-6 mb-3">
							<label className="form-label text-muted" htmlFor="minQuantity">Min amount</label>
							<input id="minQuantity" type="text" inputMode="decimal" className={INPUT_CLASS_NAME} value={filters.minQuantity} onChange={onChangeField('minQuantity')} />
						</div>
						<div className="col-6 mb-3">
							<label className="form-label text-muted" htmlFor="maxQuantity">Max amount</label>
							<input id="maxQuantity" type="text" inputMode="decimal" className={INPUT_CLASS_NAME} value={filters.maxQuantity} onChange={onChangeField('maxQuantity')} />
						</div>
					</div>

					<div className="row">
						<div className="col-6 mb-3">
							<label className="form-label text-muted" htmlFor="sortBy">Sort by</label>
							<select id="sortBy" className={SELECT_CLASS_NAME} value={filters.sortBy} onChange={onChangeField('sortBy')}>
								<option value="date">Date</option>
								<option value="quantity">Amount</option>
							</select>
						</div>
						<div className="col-6 mb-3">
							<label className="form-label text-muted" htmlFor="sortDirection">Order</label>
							<select id="sortDirection" className={SELECT_CLASS_NAME} value={filters.sortDirection} onChange={onChangeField('sortDirection')}>
								<option value="desc">Descending</option>
								<option value="asc">Ascending</option>
							</select>
						</div>
					</div>

					<button type="submit" className="btn btn-info">Search</button>
				</form>
			</Collapse>
		</section>
	)
}

SearchExpensesFilters.propTypes = {
	categories: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			subcategories: PropTypes.arrayOf(
				PropTypes.shape({
					_id: PropTypes.string.isRequired,
					name: PropTypes.string.isRequired,
					uuid: PropTypes.string.isRequired
				})
			),
			uuid: PropTypes.string.isRequired
		})
	).isRequired,
	onSearch: PropTypes.func.isRequired
}
