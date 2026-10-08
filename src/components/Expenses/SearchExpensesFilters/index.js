import { Fragment, useState } from 'react'
import PropTypes from 'prop-types'

import DatePicker from 'react-widgets/DatePicker'
import { Collapse } from 'reactstrap'
import { BsChevronDown, BsChevronUp, BsX } from 'react-icons/bs'
import 'react-widgets/styles.css'
import './styles.css'
import { areSameFilters, getAmountError, getFiltersSummaryParts } from './utils'
import { SubmitButton } from '../../SubmitButton'

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
const AMOUNT_ERROR_ID = 'searchExpensesAmountError'
const DATE_FORMAT = 'YYYY-MM-DD'

export const SearchExpensesFilters = ({ categories, onSearch }) => {
	const [filters, setFilters] = useState(INITIAL_FILTERS)
	const [appliedFilters, setAppliedFilters] = useState(null)
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
		className: 'flex-grow-1',
		valueFormat: DATE_FORMAT,
		value: filters[field],
		onChange: onChangeDate(field),
		open: openPicker === field,
		onToggle: onTogglePicker(field),
		messages: { dateButton: `Choose ${label} date` },
		inputProps: { readOnly: true, onClick: () => setOpenPicker(field) }
	})

	const renderDateField = (field, label, limits) => (
		<div className={`d-flex${filters[field] ? ' date-field-clearable' : ''}`}>
			<DatePicker {...getDatePickerProps(field, label)} {...limits} />
			{
				filters[field] && (
					<button type="button" className="btn date-field-clear" aria-label={`Clear ${label} date`} onClick={() => onChangeDate(field)(null)}>
						<BsX size={'20px'} aria-hidden="true" />
					</button>
				)
			}
		</div>
	)

	const getSubcategoryPlaceholder = () => {
		if (filters.category === '') {
			return 'Select a category first'
		}

		return subcategories.length ? 'All subcategories' : 'No subcategories'
	}

	const onSubmit = (event) => {
		event.preventDefault()
		setIsOpen(false)
		setAppliedFilters(filters)
		onSearch(filters)
	}

	const getAmountInputProps = (field, isInvalid) => ({
		id: field,
		type: 'text',
		inputMode: 'decimal',
		className: `${INPUT_CLASS_NAME}${isInvalid ? ' is-invalid' : ''}`,
		value: filters[field],
		onChange: onChangeField(field),
		'aria-invalid': isInvalid,
		'aria-describedby': isInvalid ? AMOUNT_ERROR_ID : undefined
	})

	const renderSummary = (summaryParts) => {
		if (!summaryParts.length) {
			return 'All spending'
		}

		// A part moves to the next line whole, and only wraps inside when longer than the line
		const lastIndex = summaryParts.length - 1

		return summaryParts.map((part, index) => (
			<Fragment key={part}>
				{index > 0 && ' '}
				<span className="d-inline-block mw-100">{part}{index < lastIndex && '\u00a0·'}</span>
			</Fragment>
		))
	}

	const appliedParts = appliedFilters ? getFiltersSummaryParts(appliedFilters, categories) : []

	const amountError = getAmountError(filters.minQuantity, filters.maxQuantity)
	const hasPendingChanges = appliedFilters !== null && !areSameFilters(filters, appliedFilters)
	const canClear = !areSameFilters(filters, INITIAL_FILTERS)
	const ToggleIcon = isOpen ? BsChevronUp : BsChevronDown

	return (
		<section className="mb-4">
			<button
				type="button"
				className="btn btn-outline-info w-100 mb-2 d-flex align-items-center justify-content-between gap-2 text-start"
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen}
				aria-controls={FILTERS_PANEL_ID}
			>
				<span>
					<span className="d-block">Filters{appliedParts.length > 0 && ` · ${appliedParts.length}`}</span>
					{' '}
					{appliedFilters && <span className="d-block small">{renderSummary(appliedParts)}</span>}
				</span>
				<ToggleIcon size={'16px'} className="flex-shrink-0" aria-hidden="true" />
			</button>

			<Collapse id={FILTERS_PANEL_ID} isOpen={isOpen}>
				<form onSubmit={onSubmit} className="card bg-dark border-secondary p-3 search-expenses-filters">
					<div className="mb-3">
						<div className="d-flex justify-content-between align-items-center mb-2">
							<label className="text-light" htmlFor="category">Category</label>
							<button type="button" className="btn btn-link filters-clear-all" disabled={!canClear} onClick={() => setFilters(INITIAL_FILTERS)}>Clear all</button>
						</div>
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
						<label className="form-label text-light" htmlFor="subcategory">Subcategory</label>
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
							<label className="form-label text-light" htmlFor="startDate_input">From</label>
							{renderDateField('startDate', 'From', { max: filters.endDate || undefined })}
						</div>
						<div className="col-12 col-sm-6 mb-3">
							<label className="form-label text-light" htmlFor="endDate_input">To</label>
							{renderDateField('endDate', 'To', { min: filters.startDate || undefined })}
						</div>
					</div>

					<div className="row">
						<div className="col-6 mb-3">
							<label className="form-label text-light" htmlFor="minQuantity">Min amount</label>
							<input {...getAmountInputProps('minQuantity', Boolean(amountError?.isMinInvalid))} />
						</div>
						<div className="col-6 mb-3">
							<label className="form-label text-light" htmlFor="maxQuantity">Max amount</label>
							<input {...getAmountInputProps('maxQuantity', Boolean(amountError?.isMaxInvalid))} />
						</div>
						{
							amountError && (
								<div className="col-12">
									<p id={AMOUNT_ERROR_ID} className="invalid-feedback d-block mt-0 mb-3">{amountError.message}</p>
								</div>
							)
						}
					</div>

					<div className="row mb-3">
						<div className="col-6 mb-3">
							<label className="form-label text-light" htmlFor="sortBy">Sort by</label>
							<select id="sortBy" className={SELECT_CLASS_NAME} value={filters.sortBy} onChange={onChangeField('sortBy')}>
								<option value="date">Date</option>
								<option value="quantity">Amount</option>
							</select>
						</div>
						<div className="col-6 mb-3">
							<label className="form-label text-light" htmlFor="sortDirection">Order</label>
							<select id="sortDirection" className={SELECT_CLASS_NAME} value={filters.sortDirection} onChange={onChangeField('sortDirection')}>
								<option value="desc">Descending</option>
								<option value="asc">Ascending</option>
							</select>
						</div>
					</div>

					{
						hasPendingChanges && (
							<p className="form-text text-white-50 mt-0 mb-2" role="status">The results below are still from the previous search.</p>
						)
					}
					<SubmitButton disabled={Boolean(amountError)}>Search</SubmitButton>
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
