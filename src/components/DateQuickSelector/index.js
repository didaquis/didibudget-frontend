import { useState } from 'react'
import PropTypes from 'prop-types'
import { Calendar } from 'react-widgets'
import { BsCalendar3 } from 'react-icons/bs'
import 'react-widgets/dist/css/react-widgets.css'

import '../../utils/dateLocalizer'

const startOfDay = (date) => {
	const copy = new Date(date)
	copy.setHours(0, 0, 0, 0)
	return copy
}

const isSameDay = (one, other) => {
	return startOfDay(one).getTime() === startOfDay(other).getTime()
}

export const DateQuickSelector = ({ value, onChange }) => {
	const [isCalendarOpen, setIsCalendarOpen] = useState(false)

	const today = startOfDay(new Date())

	const yesterday = startOfDay(new Date())
	yesterday.setDate(yesterday.getDate() - 1)

	const chooseDate = (date) => {
		setIsCalendarOpen(false)
		onChange(startOfDay(date))
	}

	return (
		<div>
			<div className="d-flex flex-wrap gap-2 mb-2">
				<button
					type="button"
					className={`btn btn-sm ${isSameDay(value, today) ? 'btn-info' : 'btn-outline-info'}`}
					aria-pressed={isSameDay(value, today)}
					onClick={() => chooseDate(today)}
				>
					Today
				</button>
				<button
					type="button"
					className={`btn btn-sm ${isSameDay(value, yesterday) ? 'btn-info' : 'btn-outline-info'}`}
					aria-pressed={isSameDay(value, yesterday)}
					onClick={() => chooseDate(yesterday)}
				>
					Yesterday
				</button>
				<button
					type="button"
					className="btn btn-sm btn-outline-info"
					aria-expanded={isCalendarOpen}
					onClick={() => setIsCalendarOpen(!isCalendarOpen)}
				>
					<BsCalendar3 size={'16px'} className={'me-2'} />
					Pick another date
				</button>
			</div>

			{
				isCalendarOpen && (
					<Calendar
						className="mb-3"
						id="dateQuickSelectorCalendar"
						max={new Date()}
						value={value}
						onChange={chooseDate}
						views={['month', 'year']}
						footer={false}
					/>
				)
			}
		</div>
	)
}

DateQuickSelector.propTypes = {
	value: PropTypes.instanceOf(Date).isRequired,
	onChange: PropTypes.func.isRequired
}
