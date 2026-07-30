import { getTimeAgo } from '../../../utils/utils'

/**
 * Format a timestamp as relative time, falling back to a placeholder when the
 * backend did not provide one (a user who never logged in, for instance).
 * @param {number|string|null|undefined} timestamp - The timestamp in milliseconds.
 * @param {string} fallback - Text to show when there is no timestamp.
 * @returns {string} The relative time, or the fallback.
 */
export const formatTimeAgo = (timestamp, fallback) => {
	if (timestamp === null || timestamp === undefined) { return fallback }
	return getTimeAgo(timestamp)
}
