import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

import { EmptyState } from '../../EmptyState'
import { SectionTitle } from '../../SectionTitle'
import { InformativeBadge } from '../../InformativeBadge'

import { AXIS_TICK, CHART_LINE_STROKE } from '../../../utils/charts'

import { parseDataForGraph, getLastMonthsData, computeDifferential, formatDifferential } from '../utils'


export const GraphMonthlyBalance = ({ data }) => {
	const allDataParsed = parseDataForGraph(data)
	const lastYearDataParsed = getLastMonthsData(allDataParsed, 12)
	const lastTwoYearsDataParsed = getLastMonthsData(allDataParsed, 24)
	const lastYearDifferential = computeDifferential(lastYearDataParsed)
	const lastTwoYearsDifferential = computeDifferential(lastTwoYearsDataParsed)

	if (allDataParsed.length) {
		return (
			<div>
				{
					lastYearDataParsed.length > 0 &&
					<Fragment>
						<SectionTitle>
							<span className="d-flex flex-wrap align-items-center gap-2">
								Last 12 months{' '}
								{
									lastYearDifferential !== null &&
									<InformativeBadge>Net change: {formatDifferential(lastYearDifferential)}</InformativeBadge>
								}
							</span>
						</SectionTitle>

						<ResponsiveContainer width="100%" height={460}>
							<LineChart
								data={lastYearDataParsed}
								margin={{ top: 5, right: 20, left: 30, bottom: 20 }}
							>
								<CartesianGrid strokeDasharray="3 3" stroke={CHART_LINE_STROKE} />
								<XAxis dataKey="label" interval="preserveStartEnd" stroke={CHART_LINE_STROKE} tick={AXIS_TICK} />
								<YAxis stroke={CHART_LINE_STROKE} tick={AXIS_TICK} />
								<Tooltip />
								<Line dataKey="balance" fill="#8884d8" />
							</LineChart>
						</ResponsiveContainer>
					</Fragment>
				}
				{
					lastTwoYearsDataParsed.length > 0 &&
					<Fragment>
						<SectionTitle>
							<span className="d-flex flex-wrap align-items-center gap-2">
								Last 24 months{' '}
								{
									lastTwoYearsDifferential !== null &&
									<InformativeBadge>Net change: {formatDifferential(lastTwoYearsDifferential)}</InformativeBadge>
								}
							</span>
						</SectionTitle>
						<ResponsiveContainer width="100%" height={460}>
							<LineChart
								data={lastTwoYearsDataParsed}
								margin={{ top: 5, right: 20, left: 30, bottom: 20 }}
							>
								<CartesianGrid strokeDasharray="3 3" stroke={CHART_LINE_STROKE} />
								<XAxis dataKey="label" interval="preserveStartEnd" stroke={CHART_LINE_STROKE} tick={AXIS_TICK} />
								<YAxis stroke={CHART_LINE_STROKE} tick={AXIS_TICK} />
								<Tooltip />
								<Line dataKey="balance" fill="#8884d8" />
							</LineChart>
						</ResponsiveContainer>
					</Fragment>
				}
				<SectionTitle text={`Since ${allDataParsed[0].label}`} />
				<ResponsiveContainer width="100%" height={460}>
					<LineChart
						data={allDataParsed}
						margin={{ top: 5, right: 20, left: 30, bottom: 20 }}
					>
						<CartesianGrid strokeDasharray="3 3" stroke={CHART_LINE_STROKE} />
						<XAxis dataKey="label" interval="preserveStartEnd" stroke={CHART_LINE_STROKE} tick={AXIS_TICK} />
						<YAxis stroke={CHART_LINE_STROKE} tick={AXIS_TICK} />
						<Tooltip />
						<Line dataKey="balance" fill="#8884d8" />
					</LineChart>
				</ResponsiveContainer>
			</div>
		)
	} else {
		const message = 'Not enough data yet to show the balance chart.'
		return <EmptyState message={message} />
	}
}

GraphMonthlyBalance.propTypes = {
	data: PropTypes.array.isRequired,
}