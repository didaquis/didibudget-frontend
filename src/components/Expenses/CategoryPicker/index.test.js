import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CategoryPicker } from './index'

const categories = [
	{
		_id: 'category-id-1',
		name: 'Private vehicles',
		emojis: ['🚙'],
		uuid: 'category-uuid-1',
		subcategories: [
			{ _id: 'subcategory-id-1', name: 'Fuel', uuid: 'subcategory-uuid-1', emojis: ['⛽️'] }
		]
	},
	{
		_id: 'category-id-2',
		name: 'Taxes',
		emojis: ['🏛'],
		uuid: 'category-uuid-2',
		subcategories: []
	}
]

const frequentCategories = [
	{
		category: 'category-id-1',
		categoryName: 'Private vehicles',
		categoryEmojis: ['🚙'],
		subcategory: 'subcategory-id-1',
		subcategoryName: 'Fuel',
		subcategoryEmojis: ['⛽️']
	}
]

const renderPicker = (props = {}) => {
	const onSelect = vi.fn()

	render(
		<CategoryPicker
			categories={categories}
			frequentCategories={frequentCategories}
			selected={null}
			onSelect={onSelect}
			{...props}
		/>
	)

	return { onSelect }
}

describe('CategoryPicker', () => {
	it('shows a chip for every frequent category', () => {
		renderPicker()

		expect(screen.getByRole('button', { name: /Private vehicles › Fuel/ })).toBeVisible()
	})

	it('reports the leaf when a frequent chip is chosen', async () => {
		const user = userEvent.setup()
		const { onSelect } = renderPicker()

		await user.click(screen.getByRole('button', { name: /Private vehicles › Fuel/ }))

		expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({
			categoryID: 'category-id-1',
			subcategoryID: 'subcategory-id-1'
		}))
	})

	it('hides the frequent section when there are no frequent categories', () => {
		renderPicker({ frequentCategories: [] })

		expect(screen.queryByText('Frequent')).not.toBeInTheDocument()
	})

	it('lists the categories as an accordion while the filter is empty', () => {
		renderPicker({ frequentCategories: [] })

		expect(screen.getByRole('button', { name: /Private vehicles/ })).toBeVisible()
		expect(screen.queryByRole('button', { name: 'Private vehicles › Fuel' })).not.toBeInTheDocument()
	})

	it('reveals the subcategories of a category when it is expanded', async () => {
		const user = userEvent.setup()
		renderPicker({ frequentCategories: [] })

		await user.click(screen.getByRole('button', { name: /Private vehicles/ }))

		expect(screen.getByRole('button', { name: /Fuel/ })).toBeVisible()
	})

	it('flattens the list into matching leaves while filtering', async () => {
		const user = userEvent.setup()
		renderPicker({ frequentCategories: [] })

		await user.type(screen.getByLabelText('Filter categories'), 'fue')

		expect(screen.getByRole('button', { name: /Private vehicles › Fuel/ })).toBeVisible()
		expect(screen.queryByRole('button', { name: /Taxes/ })).not.toBeInTheDocument()
	})

	it('collapses the list once a category is selected', () => {
		renderPicker({ selected: { categoryID: 'category-id-2', subcategoryID: null } })

		expect(screen.getByText('Taxes')).toBeVisible()
		expect(screen.queryByLabelText('Filter categories')).not.toBeInTheDocument()
	})

	it('reopens the list when change is pressed', async () => {
		const user = userEvent.setup()
		renderPicker({ selected: { categoryID: 'category-id-2', subcategoryID: null } })

		await user.click(screen.getByRole('button', { name: 'Change' }))

		expect(screen.getByLabelText('Filter categories')).toBeVisible()
	})
})
