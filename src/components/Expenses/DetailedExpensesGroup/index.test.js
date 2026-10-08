import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { DetailedExpensesGroup } from './'

const expensesGroupData = {
	groupTitle: 'October 2026',
	groupTotal: 42,
	perCategory: [
		{ idCategory: 'vehicles-id', totalInCategory: 42, perSubcategory: [{ idSubcategory: 'fuel-id', totalInSubcategory: 42 }] }
	]
}

const categories = [
	{ _id: 'vehicles-id', uuid: 'vehicles-uuid', name: 'Private vehicles', subcategories: [{ _id: 'fuel-id', uuid: 'fuel-uuid', name: 'Fuel' }] }
]

describe('DetailedExpensesGroup', () => {
	it('should show the subcategories once the toggle is switched on', async () => {
		const user = userEvent.setup()
		render(<DetailedExpensesGroup expensesGroupData={expensesGroupData} categories={categories} />)

		expect(screen.queryByText('Fuel')).not.toBeInTheDocument()

		await user.click(screen.getByRole('checkbox', { name: 'Show subcategories' }))

		expect(screen.getByText('Fuel')).toBeVisible()
	})
})
