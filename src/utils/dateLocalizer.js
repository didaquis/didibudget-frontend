import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment'

/**
 * Importing this module configures the react-widgets date localizer. It has no exports: import it
 * for the side effect, once, from any component rendering a react-widgets date component.
 */
Moment.updateLocale('en', {
	week: {
		dow: 1 // Monday is the first day of the week.
	}
})

momentLocalizer()
