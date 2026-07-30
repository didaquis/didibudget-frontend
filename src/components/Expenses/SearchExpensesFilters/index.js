import { useState } from 'react'
import PropTypes from 'prop-types'

import DatePicker from 'react-widgets/DatePicker'
import { Collapse } from 'reactstrap'
import 'react-widgets/styles.css'
import './styles.css'
import { buildFiltersSummary, isValidAmountInput } from './utils'

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

const SELECT_CLASS_NAME = 'form-select'
const INPUT_CLASS_NAME = 'form-control'
const FILTERS_PANEL_ID = 'searchExpensesFiltersPanel'
const DATE_FORMAT = 'YYYY-MM-DD'

export const SearchExpensesFilters = ({ categories, onSearch }) => {
	const [filters, setFilters] = useState(INITIAL_FILTERS)
	const [isOpen, setIsOpen] = useState(true)
	const [openPicker, setOpenPicker] = useState(null)

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

	const onTogglePicker = (field) => (isPickerOpen) => {
		setOpenPicker(isPickerOpen ? field : null)
	}

	const getDatePickerProps = (field, label) => ({
		id: field,
		format: DATE_FORMAT,
		value: filters[field],
		onChange: onChangeDate(field),
		open: openPicker === field,
		onToggle: onTogglePicker(field),
		inputProps: { 'aria-label': label, readOnly: true, onClick: () => setOpenPicker(field) }
	})

	const getSubcategoryPlaceholder = () => {
		if (filters.category === '') {
			return 'Select a category first'
		}

		return subcategories.length ? 'All subcategories' : 'No subcategories'
	}

	const onSubmit = (event) => {
		event.preventDefault()
		setIsOpen(false)
		onSearch(filters)
	}

	const isMinQuantityValid = isValidAmountInput(filters.minQuantity)
	const isMaxQuantityValid = isValidAmountInput(filters.maxQuantity)
	const isAmountInvalid = !isMinQuantityValid || !isMaxQuantityValid

	return (
		<section className="mb-4">
			<button
				type="button"
				className="btn btn-outline-info w-100 mb-2"
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen}
				aria-controls={FILTERS_PANEL_ID}
			>
				{buildFiltersSummary(filters, categories)}
			</button>

			<Collapse id={FILTERS_PANEL_ID} isOpen={isOpen}>
				<form onSubmit={onSubmit} className="card bg-dark border-secondary p-3 search-expenses-filters">
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
							<option value="">{getSubcategoryPlaceholder()}</option>
							{
								subcategories.map(subcategory => (
									<option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
								))
							}
						</select>
					</div>

					<div className="row">
						<div className="col-12 col-sm-6 mb-3">
							<label className="form-label text-muted" htmlFor="startDate">From</label>
							<DatePicker {...getDatePickerProps('startDate', 'From')} />
						</div>
						<div className="col-12 col-sm-6 mb-3">
							<label className="form-label text-muted" htmlFor="endDate">To</label>
							<DatePicker {...getDatePickerProps('endDate', 'To')} />
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
						{
							isAmountInvalid && (
								<div className="col-12">
									<small className="d-block text-muted mb-3">Amount must be a number using a decimal point or comma</small>
								</div>
							)
						}
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

					<button type="submit" className="btn btn-info" disabled={isAmountInvalid}>Search</button>
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
