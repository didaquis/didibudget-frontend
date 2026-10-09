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
	it('should title the month with its total and name its table after the month', () => {
		render(<DetailedExpensesGroup expensesGroupData={expensesGroupData} categories={categories} />)

		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('October 202642 €')
		expect(screen.getByRole('table', { name: 'October 2026' })).toBeInTheDocument()
	})

	it('should show the subcategories once the toggle is switched on', async () => {
		const user = userEvent.setup()
		render(<DetailedExpensesGroup expensesGroupData={expensesGroupData} categories={categories} />)

		expect(screen.queryByText('Fuel')).not.toBeInTheDocument()

		await user.click(screen.getByRole('switch', { name: 'Show subcategories for October 2026' }))

		expect(screen.getByText('Fuel')).toBeVisible()
	})
})
