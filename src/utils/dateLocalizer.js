import { DateLocalizer } from 'react-widgets/IntlLocalizer'

const CULTURE = 'en-US'

const formatWeekday = new Intl.DateTimeFormat(CULTURE, { weekday: 'short' }).format
const formatDate = new Intl.DateTimeFormat(CULTURE, { year: 'numeric', month: '2-digit', day: '2-digit' }).format

export const dateLocalizer = new DateLocalizer({ culture: CULTURE, firstOfWeek: 1 })

// Intl's defaults are one-letter weekdays (M T W T F S S) and two-digit years
const intlWeekday = dateLocalizer.weekday
const intlDate = dateLocalizer.date
dateLocalizer.weekday = (date, format) => format ? intlWeekday(date, format) : formatWeekday(date).slice(0, 2)
dateLocalizer.date = (date, format) => format ? intlDate(date, format) : formatDate(date)
