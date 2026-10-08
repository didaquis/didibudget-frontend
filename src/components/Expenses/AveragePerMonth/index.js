import { useContext } from 'react'
import PropTypes from 'prop-types'

import { monthsBetweenDates } from '../utils'
import { AuthContext } from '../../../AuthContext'
import { SectionTitle } from '../../SectionTitle'

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
		<section className="col-12 col-md-6 mb-3">
			<SectionTitle text={title} />

			<div className="table-responsive">
				<table className="table table-dark table-hover">
					<thead>
						<tr className="table-info text-dark">
							<th scope="col">Period</th>
							<th scope="col">Per month</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Last 3 months</td>
							<td className="text-nowrap">{averageData.lastThreeMonthsAverage.average} €</td>
						</tr>
						{
							!!(monthsSinceUserJoined > minimunMonthsRequiredForAverageDisplaySix) && <tr>
								<td>Last 6 months</td>
								<td className="text-nowrap">{averageData.lastSixMonthsAverage.average} €</td>
							</tr>
						}
						{
							!!(monthsSinceUserJoined > minimunMonthsRequiredForAverageDisplayTwelve) && <tr>
								<td>Last 12 months</td>
								<td className="text-nowrap">{averageData.lastTwelveMonthsAverage.average} €</td>
							</tr>
						}

						{
							!!(monthsSinceUserJoined > minimunMonthsRequiredForAverageDisplayTwentyFour) && <tr>
								<td>Last 24 months</td>
								<td className="text-nowrap">{averageData.lastTwentyFourMonthsAverage.average} €</td>
							</tr>
						}
					</tbody>
				</table>
			</div>
		</section>
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
