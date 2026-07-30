import moment from 'moment'
import MomentLocalizer from 'react-widgets-moment'

moment.updateLocale('en', {
	week: {
		dow: 1 // Monday is the first day of the week.
	}
})

export const dateLocalizer = new MomentLocalizer(moment)
