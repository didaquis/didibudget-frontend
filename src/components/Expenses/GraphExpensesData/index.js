import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts'

import { parseUnixTimestamp } from '../../../utils/utils'
import { AXIS_TICK, CHART_LINE_STROKE, SERIES_COLOR, TOOLTIP_ITEM_STYLE, shortMonthLabel } from '../../../utils/charts'
import { getSumPerMonth, getLastNValuesFromArrayIfTheyExist } from '../utils'

import { EmptyState } from '../../EmptyState'
import { SectionTitle } from '../../SectionTitle'
import { formatAmount } from '../../../utils/currency'
import { AveragePerMonth } from '../AveragePerMonth'


export const GraphExpensesData = ({ graphData, averageData, averageDataExcludingSavings }) => {

	const dataParsed = graphData.map((expense) => {
		return {
			...expense,
			date: parseUnixTimestamp(expense.date).substring(0, 10)
		}
	})

	const dataGroupedPerMonth = getSumPerMonth(dataParsed)
	const currencyISO = graphData[0]?.currencyISO

	const numberOfMonthsToDisplay = 24
	const dataGroupedPerMonthSubset = getLastNValuesFromArrayIfTheyExist(dataGroupedPerMonth, numberOfMonthsToDisplay)

	if (dataGroupedPerMonth.length) {
		return (
			<Fragment>
				<div className="row">
					<AveragePerMonth averageData={averageData} title="Average spending" />

					<AveragePerMonth averageData={averageDataExcludingSavings} title="Average spending, excluding savings & investments" />
				</div>

				{
					dataGroupedPerMonthSubset.length > 0 &&
					<Fragment>
						<SectionTitle text={`Last ${numberOfMonthsToDisplay} months`} />
						<ResponsiveContainer width="100%" height={460}>
							<BarChart
								data={dataGroupedPerMonthSubset}
								accessibilityLayer={false}
								role="img"
								title={`Bar chart of spending per month over the last ${numberOfMonthsToDisplay} months`}
								margin={{ top: 5, right: 20, left: 20, bottom: 20 }}
							>
								<CartesianGrid strokeDasharray="3 3" stroke={CHART_LINE_STROKE} />
								<XAxis dataKey="label" stroke={CHART_LINE_STROKE} tick={AXIS_TICK} tickFormatter={shortMonthLabel} />
								<YAxis stroke={CHART_LINE_STROKE} tick={AXIS_TICK} />
								<Tooltip itemStyle={TOOLTIP_ITEM_STYLE} separator=': ' formatter={value => formatAmount(value, currencyISO)} />
								<Bar dataKey="sum" fill={SERIES_COLOR} />
							</BarChart>
						</ResponsiveContainer>
					</Fragment>
				}

				<SectionTitle text={`Since ${dataGroupedPerMonth[0].label}`} />
				<ResponsiveContainer width="100%" height={460}>
					<BarChart
						data={dataGroupedPerMonth}
						accessibilityLayer={false}
						role="img"
						title={`Bar chart of spending per month since ${dataGroupedPerMonth[0].label}`}
						margin={{ top: 5, right: 20, left: 20, bottom: 20 }}
					>
						<CartesianGrid strokeDasharray="3 3" stroke={CHART_LINE_STROKE} />
						<XAxis dataKey="label" stroke={CHART_LINE_STROKE} tick={AXIS_TICK} tickFormatter={shortMonthLabel} />
						<YAxis stroke={CHART_LINE_STROKE} tick={AXIS_TICK} />
						<Tooltip itemStyle={TOOLTIP_ITEM_STYLE} separator=': ' formatter={value => formatAmount(value, currencyISO)} />
						<Bar dataKey="sum" fill={SERIES_COLOR} />
					</BarChart>
				</ResponsiveContainer>

			</Fragment>
		)
	} else {
		const message = 'Not enough data yet to show spending statistics.'
		return <EmptyState message={message} />
	}
}

GraphExpensesData.propTypes = {
	graphData: PropTypes.array.isRequired,
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