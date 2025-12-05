import { Fragment, useContext } from 'react'
import PropTypes from 'prop-types'

import { getAveragePerMonth, averageOfLast, monthsBetweenDates } from '../utils'
import { AuthContext } from '../../../AuthContext'
import { PageSubTitle } from '../../PageSubTitle'

export const AveragePerMonth = ({ averageData, averageDataExcludingSavings }) => {

	const {userData } = useContext(AuthContext)

	const monthsSinceUserJoined = monthsBetweenDates(new Date(userData.registrationDate), new Date())

	console.log(monthsSinceUserJoined)

	return (		<Fragment></Fragment>)
	// const averagePerMonthExceptSecondLast = getAveragePerMonth(data)

	// const lastThreeMonths = averageOfLast(averagePerMonthExceptSecondLast, 3)
	// const lastSixMonths = averageOfLast(averagePerMonthExceptSecondLast, 6)
	// const lastTwelveMonths = averageOfLast(averagePerMonthExceptSecondLast, 12)
	// const lastTwentyFourMonths = averageOfLast(averagePerMonthExceptSecondLast, 24)

	// if (!!lastThreeMonths || !!lastSixMonths || !!lastTwelveMonths || !!lastTwentyFourMonths) {
	// 	return (
	// 		<Fragment>
	// 			<PageSubTitle text="Average spending:"/>
	// 		{
	// 			!!lastThreeMonths && <p className="font-weight-light text-light">
	// 				Over past <strong>3 months</strong>, the average monthly spending has been <span className="text-nowrap">{lastThreeMonths} €.</span>
	// 			</p>
	// 		}
	// 		{
	// 			!!lastSixMonths && <p className="font-weight-light text-light">
	// 				Over past <strong>6 months</strong>, the average monthly spending has been <span className="text-nowrap">{lastSixMonths} €.</span>
	// 			</p>
	// 		}
	// 		{
	// 			!!lastTwelveMonths && <p className="font-weight-light text-light">
	// 				Over past <strong>12 months</strong>, the average monthly spending has been <span className="text-nowrap">{lastTwelveMonths} €.</span>
	// 			</p>
	// 		}
	// 		{
	// 			!!lastTwentyFourMonths && <p className="font-weight-light text-light">
	// 				Over past <strong>24 months</strong>, the average monthly spending has been <span className="text-nowrap">{lastTwentyFourMonths} €.</span>
	// 			</p>
	// 		}
	// 		</Fragment>
	// 	)
	// }

}

AveragePerMonth.propTypes = {
	averageData: PropTypes.shape({
		lastThreeMonthsAverage: PropTypes.shape({
			average: PropTypes.number.isRequired,
			currencyISO: PropTypes.string.isRequired,
		}).isRequired,
		lastSixMonthsAverage: PropTypes.shape({
			average: PropTypes.number.isRequired,
			currencyISO: PropTypes.string.isRequired,
		}).isRequired,
		lastTwelveMonthsAverage: PropTypes.shape({
			average: PropTypes.number.isRequired,
			currencyISO: PropTypes.string.isRequired,
		}).isRequired,
		lastTwentyFourMonthsAverage: PropTypes.shape({
			average: PropTypes.number.isRequired,
			currencyISO: PropTypes.string.isRequired,
		}).isRequired,
	}).isRequired,
	averageDataExcludingSavings: PropTypes.shape({
		lastThreeMonthsAverage: PropTypes.shape({
			average: PropTypes.number.isRequired,
			currencyISO: PropTypes.string.isRequired,
		}).isRequired,
		lastSixMonthsAverage: PropTypes.shape({
			average: PropTypes.number.isRequired,
			currencyISO: PropTypes.string.isRequired,
		}).isRequired,
		lastTwelveMonthsAverage: PropTypes.shape({
			average: PropTypes.number.isRequired,
			currencyISO: PropTypes.string.isRequired,
		}).isRequired,
		lastTwentyFourMonthsAverage: PropTypes.shape({
			average: PropTypes.number.isRequired,
			currencyISO: PropTypes.string.isRequired,
		}).isRequired,
	}).isRequired,
}
