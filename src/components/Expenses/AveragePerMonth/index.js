import { Fragment, useContext } from 'react'
import PropTypes from 'prop-types'

import { monthsBetweenDates } from '../utils'
import { AuthContext } from '../../../AuthContext'
import { PageSubTitle } from '../../PageSubTitle'

export const AveragePerMonth = ({ averageData, title }) => {

	const { userData } = useContext(AuthContext)

	const monthsSinceUserJoined = monthsBetweenDates(new Date(userData.registrationDate), new Date())

	const minimunMonthsRequiredForAverageDisplayThree = 4
	const minimunMonthsRequiredForAverageDisplaySix = 7
	const minimunMonthsRequiredForAverageDisplayTwelve = 13
	const minimunMonthsRequiredForAverageDisplayTwentyFour = 25

	if (monthsSinceUserJoined < minimunMonthsRequiredForAverageDisplayThree) {
		return null
	}

	return (
		<Fragment>
			<PageSubTitle text={title}/>
		{
			<p className="font-weight-light text-light">
				Over past <strong>3 months</strong>, the average monthly spending has been <span className="text-nowrap">{averageData.lastThreeMonthsAverage.average} €.</span>
			</p>
		}
		{
			!!(monthsSinceUserJoined > minimunMonthsRequiredForAverageDisplaySix) && <p className="font-weight-light text-light">
				Over past <strong>6 months</strong>, the average monthly spending has been <span className="text-nowrap">{averageData.lastSixMonthsAverage.average} €.</span>
			</p>
		}
		{
			!!(monthsSinceUserJoined > minimunMonthsRequiredForAverageDisplayTwelve) && <p className="font-weight-light text-light">
				Over past <strong>12 months</strong>, the average monthly spending has been <span className="text-nowrap">{averageData.lastTwelveMonthsAverage.average} €.</span>
			</p>
		}
		{
			!!(monthsSinceUserJoined > minimunMonthsRequiredForAverageDisplayTwentyFour) && <p className="font-weight-light text-light">
				Over past <strong>24 months</strong>, the average monthly spending has been <span className="text-nowrap">{averageData.lastTwentyFourMonthsAverage.average} €.</span>
			</p>
		}
		</Fragment>
	)
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
	title: PropTypes.string.isRequired,
}
