export const expensesRawData = [
	{
		'category': '5e64ec217048af874c4f14cd',
		'subcategory': null,
		'quantity': 99,
		'date': '2020-10-31',
		'currencyISO': 'EUR',
		'uuid': '040b7060-6322-4cf7-9f52-2cacd5c0be10',
		'__typename': 'Expense'
	},
	{
		'category': '5e64ec217048af874c4f14d8',
		'subcategory': '5e64ec217048af874c4f14c1',
		'quantity': 15,
		'date': '2020-12-09',
		'currencyISO': 'EUR',
		'uuid': 'f2a8c74e-036f-4cee-ba96-25f35b21c814',
		'__typename': 'Expense'
	},
	{
		'category': '5e64ec217048af874c4f14d6',
		'subcategory': '5e64ec217048af874c4f14b1',
		'quantity': 40,
		'date': '2020-12-13',
		'currencyISO': 'EUR',
		'uuid': '51c309d8-d854-4e86-a35c-9de1cb14d905',
		'__typename': 'Expense'
	},
	{
		'category': '5e64ec217048af874c4f14d7',
		'subcategory': '5ea7113296474318495ba3e5',
		'quantity': 70,
		'date': '2020-12-14',
		'currencyISO': 'EUR',
		'uuid': '117685cb-2b0b-48b1-be56-8f75e24afc8a',
		'__typename': 'Expense'
	},
	{
		'category': '5e64ec217048af874c4f14d7',
		'subcategory': '5e64ec217048af874c4f14b4',
		'quantity': 3.16,
		'date': '2020-12-21',
		'currencyISO': 'EUR',
		'uuid': '7b9ae121-6e20-4032-94cb-3bc4d755fa7a',
		'__typename': 'Expense'
	},
	{
		'category': '5e64ec217048af874c4f14d8',
		'subcategory': '5e64ec217048af874c4f14c1',
		'quantity': 15,
		'date': '2020-12-23',
		'currencyISO': 'EUR',
		'uuid': '6c2507d5-ee68-47d8-9593-e520a02ffbff',
		'__typename': 'Expense'
	},
	{
		'category': '5e64ec217048af874c4f14d2',
		'subcategory': null,
		'quantity': 23,
		'date': '2020-12-30',
		'currencyISO': 'EUR',
		'uuid': '9bed446f-c28d-4989-ba53-45b000947a62',
		'__typename': 'Expense'
	},
	{
		'category': '5e64ec217048af874c4f14d6',
		'subcategory': '5e64ec217048af874c4f14b1',
		'quantity': 40,
		'date': '2021-01-10',
		'currencyISO': 'EUR',
		'uuid': '0363b8bc-c40c-401b-b285-2f7bc58ba210',
		'__typename': 'Expense'
	}
]

export const expectedData = [
	{
		label: 'October 2020',
		sum: 99
	},
	{
		label: 'November 2020',
		sum: 0
	},
	{
		label: 'December 2020',
		sum: 166.16
	},
	{
		label: 'January 2021',
		sum: 40
	}
]

export const expensesRawDataForGetDetailedExpendesPerMonth = [
	{
		'category': '5e64ec217048af874c4f14d7',
		'subcategory': '5ea7113296474318495ba3e5',
		'quantity': 140,
		'date': '1610506408699',
		'currencyISO': 'EUR',
		'uuid': '040b7060-6322-4cf7-9f52-2cacd5c0be10',
		'__typename': 'Expense'
	},
	{
		'category': '5e64ec217048af874c4f14d7',
		'subcategory': '5e64ec217048af874c4f14b4',
		'quantity': 66,
		'date': '1611506408699',
		'currencyISO': 'EUR',
		'uuid': '040b7060-6322-4cf7-9f52-2cacd5c0be11',
		'__typename': 'Expense'
	},
	{
		'category': '5e64ec217048af874c4f14d7',
		'subcategory': '5e64ec217048af874c4f14b4',
		'quantity': 1,
		'date': '1611516408699',
		'currencyISO': 'EUR',
		'uuid': '040b7060-6322-4cf7-9f52-2cacd5c0be20',
		'__typename': 'Expense'
	},
	{
		'category': '5e64ec217048af874c4f14d8',
		'subcategory': '5e64ec217048af874c4f14c1',
		'quantity': 27,
		'date': '1611526408699',
		'currencyISO': 'EUR',
		'uuid': '040b7060-6322-4cf7-9f52-2cacd5c0be12',
		'__typename': 'Expense'
	},
	{
		'category': '5e64ec217048af874c4f14d8',
		'subcategory': '5e64ec217048af874c4f14c2',
		'quantity': 6,
		'date': '1611547408699',
		'currencyISO': 'EUR',
		'uuid': '040b7060-6322-4cf7-9f52-2cacd5c0be13',
		'__typename': 'Expense'
	},
	{
		'category': '5e64ec217048af874c4f14d2',
		'subcategory': null,
		'quantity': 2,
		'date': '1615547408699',
		'currencyISO': 'EUR',
		'uuid': '040b7060-6322-4cf7-9f52-2cacd5c0be14',
		'__typename': 'Expense'
	},
	{
		'category': '5e64ec217048af874c4f14d2',
		'subcategory': null,
		'quantity': 3,
		'date': '1615547408699',
		'currencyISO': 'EUR',
		'uuid': '040b7060-6322-4cf7-9f52-2cacd5c0be15',
		'__typename': 'Expense'
	},
]

export const expectedDataForGetDetailedExpendesPerMonth = [{
	month: 'January 2021',
	totalInMonth: 240,
	perCategory: [
		{
			uuidCategory: '5e64ec217048af874c4f14d7',
			totalInCategory: 207,
			perSubcategory: [
				{
					uuidSubcategory: '5ea7113296474318495ba3e5',
					totalInSubcategory: 140
				},
				{
					uuidSubcategory: '5e64ec217048af874c4f14b4',
					totalInSubcategory: 67
				}
			]
		},
		{
			uuidCategory: '5e64ec217048af874c4f14d8',
			totalInCategory: 33,
			perSubcategory: [
				{
					uuidSubcategory: '5e64ec217048af874c4f14c1',
					totalInSubcategory: 27
				},
				{
					uuidSubcategory: '5e64ec217048af874c4f14c2',
					totalInSubcategory: 6
				}
			]
		}
	]
},
{
	month: 'February 2021',
	totalInMonth: 0,
	perCategory: []
},
{
	month: 'March 2021',
	totalInMonth: 5,
	perCategory: [
		{
			uuidCategory: '5e64ec217048af874c4f14d2',
			totalInCategory: 5,
			perSubcategory: []
		}
	]
}]