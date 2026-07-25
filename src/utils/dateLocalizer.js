import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment'

/**
 * react-widgets needs a date localizer configured once, before any of its date components render.
 * Importing this module performs that setup, and module caching keeps it to a single execution.
 *
 * It lives here rather than in each component because `Moment.locale` mutates a global: with more
 * than one copy of this configuration, the last one to run would win, and the first day of the week
 * would depend on render order.
 */
Moment.locale('en', {
	week: {
		dow: 1 // Monday is the first day of the week.
	}
})

momentLocalizer()
