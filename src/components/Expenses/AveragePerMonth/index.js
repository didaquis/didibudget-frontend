import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { getAveragePerMonth, averageOfLast } from '../utils'

import { PageSubTitle } from '../../PageSubTitle'

export const AveragePerMonth = ({ data }) => {
	const averagePerMonthExceptSecondLast = getAveragePerMonth(data)

	const lastThreeMonths = averageOfLast(averagePerMonthExceptSecondLast, 3)
	const lastSixMonths = averageOfLast(averagePerMonthExceptSecondLast, 6)
	const lastTwelveMonths = averageOfLast(averagePerMonthExceptSecondLast, 12)
	const lastTwentyFourMonths = averageOfLast(averagePerMonthExceptSecondLast, 24)

	if (!!lastThreeMonths || !!lastSixMonths || !!lastTwelveMonths || !!lastTwentyFourMonths) {
		return (
			<Fragment>
				<PageSubTitle text="Average expenses: (excluding the current month)"/>
			{
				!!lastThreeMonths && <p className="font-weight-light text-light">
					Over the past <strong>3 months</strong>, the average monthly spending has been <span className="text-nowrap">{lastThreeMonths} €.</span>
				</p>
			}
			{
				!!lastSixMonths && <p className="font-weight-light text-light">
					Over the past <strong>6 months</strong>, the average monthly spending has been <span className="text-nowrap">{lastSixMonths} €.</span>
				</p>
			}
			{
				!!lastTwelveMonths && <p className="font-weight-light text-light">
					Over the past <strong>12 months</strong>, the average monthly spending has been <span className="text-nowrap">{lastTwelveMonths} €.</span>
				</p>
			}
			{
				!!lastTwentyFourMonths && <p className="font-weight-light text-light">
					Over the past <strong>24 months</strong>, the average monthly spending has been <span className="text-nowrap">{lastTwentyFourMonths} €.</span>
				</p>
			}
			</Fragment>
		)
	}

}

AveragePerMonth.propTypes = {
	data: PropTypes.array.isRequired,
}
