// Fill is text-white-50. Recharts' default tick colour (#666) is under 4.5:1 on the dark page
export const AXIS_TICK = { fill: 'rgba(255, 255, 255, 0.5)', fontSize: 14 }

// Grid and axis lines stay fainter than the tick labels
export const CHART_LINE_STROKE = 'rgba(255, 255, 255, 0.15)'

/**
 * Axis-only short form of a chart month label; tooltips keep the full label
 * @example
 *   shortMonthLabel('September 2026') // 'Sep 2026'
 * @param {string} label 'Month YYYY', as built by the chart data parsers
 * @returns {string}
 */
export const shortMonthLabel = (label) => label.replace(/^(\p{L}{3})\p{L}*/u, '$1')

// Neutral, so cyan stays for what you can tap
export const SERIES_COLOR = 'rgba(255, 255, 255, 0.7)'

// Recharts colours tooltip items with the series colour, which is near-white on the tooltip's white box
export const TOOLTIP_ITEM_STYLE = { color: '#212529' }
