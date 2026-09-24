const rawData = [
	{ balance: 0, year: 2014, month: 'NOVEMBER' },
	{ balance: 678.74, year: 2014, month: 'DECEMBER' },
	{ balance: 995.3249, year: 2015, month: 'JANUARY' },
	{ balance: 8110.37, year: 2015, month: 'MARCH' }
]

const allDataParsed = [
	{ key: '2014-11', label: 'November 2014', balance: 0 },
	{ key: '2014-12', label: 'December 2014', balance: 678.74 },
	{ key: '2015-01', label: 'January 2015', balance: 995.32 },
	{ key: '2015-02', label: 'February 2015' },
	{ key: '2015-03', label: 'March 2015', balance: 8110.37 }
]

const allDataParsedFewMonths = [
	{ key: '2014-11', label: 'November 2014', balance: 0 },
	{ key: '2014-12', label: 'December 2014', balance: 678.74 },
	{ key: '2015-01', label: 'January 2015', balance: 995.32 },
	{ key: '2015-02', label: 'February 2015' },
	{ key: '2015-03', label: 'March 2015', balance: 8110.37 }
]

const allDataParsedEnoughtMonths = [
	{ key: '2014-11', label: 'November 2014', balance: 0 },
	{ key: '2014-12', label: 'December 2014', balance: 678.74 },
	{ key: '2015-01', label: 'January 2015', balance: 995.32 },
	{ key: '2015-02', label: 'February 2015' },
	{ key: '2015-03', label: 'March 2015', balance: 8110.37 },
	{ key: '2015-04', label: 'April 2015', balance: 9210.44 },
	{ key: '2015-05', label: 'May 2015', balance: 1210.01 },
	{ key: '2015-06', label: 'June 2015', balance: 587.99 },
	{ key: '2015-07', label: 'July 2015', balance: 0 },
	{ key: '2015-08', label: 'August 2015', balance: 853.23 },
	{ key: '2015-09', label: 'September 2015', balance: 1266.72 },
	{ key: '2015-10', label: 'October 2015', balance: 2476.87 }
]

const allDataParsedLotOfMonths = [
	{ key: '2014-09', label: 'September 2014', balance: 238.92 },
	{ key: '2014-10', label: 'October 2014', balance: 26.43 },
	{ key: '2014-11', label: 'November 2014', balance: 0 },
	{ key: '2014-12', label: 'December 2014', balance: 678.74 },
	{ key: '2015-01', label: 'January 2015', balance: 995.32 },
	{ key: '2015-02', label: 'February 2015' },
	{ key: '2015-03', label: 'March 2015', balance: 8110.37 },
	{ key: '2015-04', label: 'April 2015', balance: 9210.44 },
	{ key: '2015-05', label: 'May 2015', balance: 1210.01 },
	{ key: '2015-06', label: 'June 2015', balance: 587.99 },
	{ key: '2015-07', label: 'July 2015', balance: 0 },
	{ key: '2015-08', label: 'August 2015', balance: 853.23 },
	{ key: '2015-09', label: 'September 2015', balance: 1266.72 },
	{ key: '2015-10', label: 'October 2015', balance: 2476.87 }
]

const lastYearDataParsed = [
	{ key: '2014-11', label: 'November 2014', balance: 0 },
	{ key: '2014-12', label: 'December 2014', balance: 678.74 },
	{ key: '2015-01', label: 'January 2015', balance: 995.32 },
	{ key: '2015-02', label: 'February 2015' },
	{ key: '2015-03', label: 'March 2015', balance: 8110.37 },
	{ key: '2015-04', label: 'April 2015', balance: 9210.44 },
	{ key: '2015-05', label: 'May 2015', balance: 1210.01 },
	{ key: '2015-06', label: 'June 2015', balance: 587.99 },
	{ key: '2015-07', label: 'July 2015', balance: 0 },
	{ key: '2015-08', label: 'August 2015', balance: 853.23 },
	{ key: '2015-09', label: 'September 2015', balance: 1266.72 },
	{ key: '2015-10', label: 'October 2015', balance: 2476.87 }
]

export {
	rawData,
	allDataParsed,
	allDataParsedFewMonths,
	allDataParsedEnoughtMonths,
	allDataParsedLotOfMonths,
	lastYearDataParsed
}