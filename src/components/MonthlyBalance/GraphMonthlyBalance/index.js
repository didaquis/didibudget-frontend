import { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

import { EmptyState } from '../../EmptyState'
import { SectionTitle } from '../../SectionTitle'
import { InformativeBadge } from '../../InformativeBadge'

import { parseDataForGraph, getLastMonthsData, computeDifferential, formatDifferential } from '../utils'


class CustomizedAxisTick extends PureComponent {
	render() {
		const { x, y, payload } = this.props

		return (
			<g transform={`translate(${x},${y})`}>
				<text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-45)">{payload.value}</text>
			</g>
		)
	}
}

export const GraphMonthlyBalance = ({ data }) => {
	const allDataParsed = parseDataForGraph(data)
	const lastYearDataParsed = getLastMonthsData(allDataParsed, 12)
	const lastTwoYearsDataParsed = getLastMonthsData(allDataParsed, 24)
	const lastYearDifferential = computeDifferential(lastYearDataParsed)
	const lastTwoYearsDifferential = computeDifferential(lastTwoYearsDataParsed)

	if (allDataParsed.length) {
		return (
			<div>
				<SectionTitle text="All available data:" />
				<ResponsiveContainer width="100%" height={460}>
					<LineChart
						data={allDataParsed}
						margin={{ top: 5, right: 20, left: 30, bottom: 100 }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="label" interval="preserveStartEnd" tick={<CustomizedAxisTick />} />
						<YAxis />
						<Tooltip />
						<Line dataKey="balance" fill="#8884d8" />
					</LineChart>
				</ResponsiveContainer>
				{
					lastYearDataParsed.length > 0 &&
					<Fragment>
						<SectionTitle>
							<span className="d-flex flex-wrap align-items-center gap-2">
								Data from the last 12 entries is shown:{' '}
								{
									lastYearDifferential !== null &&
									<InformativeBadge>Net change: {formatDifferential(lastYearDifferential)}</InformativeBadge>
								}
							</span>
						</SectionTitle>

						<ResponsiveContainer width="100%" height={460}>
							<LineChart
								data={lastYearDataParsed}
								margin={{ top: 5, right: 20, left: 30, bottom: 100 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="label" interval="preserveStartEnd" tick={<CustomizedAxisTick />} />
								<YAxis />
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
								Data from the last 24 entries is shown:{' '}
								{
									lastTwoYearsDifferential !== null &&
									<InformativeBadge>Net change: {formatDifferential(lastTwoYearsDifferential)}</InformativeBadge>
								}
							</span>
						</SectionTitle>
						<ResponsiveContainer width="100%" height={460}>
							<LineChart
								data={lastTwoYearsDataParsed}
								margin={{ top: 5, right: 20, left: 30, bottom: 100 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="label" interval="preserveStartEnd" tick={<CustomizedAxisTick />} />
								<YAxis />
								<Tooltip />
								<Line dataKey="balance" fill="#8884d8" />
							</LineChart>
						</ResponsiveContainer>
					</Fragment>
				}
			</div>
		)
	} else {
		const message = 'Not enough data yet to show the balance chart'
		return <EmptyState message={message} />
	}
}

GraphMonthlyBalance.propTypes = {
	data: PropTypes.array.isRequired,
}