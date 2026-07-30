import { render, screen, within } from '@testing-library/react'
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

		expect(screen.queryByText('Most used')).not.toBeInTheDocument()
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

	it('exposes the subcategories of an expanded category as a named list', async () => {
		const user = userEvent.setup()
		renderPicker({ frequentCategories: [] })

		await user.click(screen.getByRole('button', { name: /Private vehicles/ }))

		expect(screen.getByRole('list', { name: 'Subcategories of Private vehicles' })).toBeVisible()
	})

	it('shows only the own emojis of a subcategory in the accordion', async () => {
		const user = userEvent.setup()
		renderPicker({ frequentCategories: [] })

		await user.click(screen.getByRole('button', { name: /Private vehicles/ }))

		const subcategories = screen.getByRole('list', { name: 'Subcategories of Private vehicles' })
		const subcategory = within(subcategories).getByRole('listitem')

		expect(subcategory).toHaveTextContent('⛽️')
		expect(subcategory).not.toHaveTextContent('🚙')
	})

	it('keeps both category and subcategory emojis on a frequent chip', () => {
		renderPicker()

		const frequentChip = screen.getByRole('button', { name: 'Private vehicles › Fuel' })

		expect(frequentChip).toHaveTextContent('🚙')
		expect(frequentChip).toHaveTextContent('⛽️')
	})

	it('flattens the list into matching leaves while filtering', async () => {
		const user = userEvent.setup()
		renderPicker({ frequentCategories: [] })

		await user.type(screen.getByLabelText('Filter categories'), 'fue')

		expect(screen.getByRole('button', { name: /Private vehicles › Fuel/ })).toBeVisible()
		expect(screen.queryByRole('button', { name: /Taxes/ })).not.toBeInTheDocument()
	})

	it('hides the clear button while the filter is empty', () => {
		renderPicker({ frequentCategories: [] })

		expect(screen.queryByRole('button', { name: 'Clear filter' })).not.toBeInTheDocument()
	})

	it('restores the accordion when the filter is cleared', async () => {
		const user = userEvent.setup()
		renderPicker({ frequentCategories: [] })
		await user.type(screen.getByLabelText('Filter categories'), 'fue')

		await user.click(screen.getByRole('button', { name: 'Clear filter' }))

		expect(screen.getByLabelText('Filter categories')).toHaveValue('')
		expect(screen.queryByRole('button', { name: 'Private vehicles › Fuel' })).not.toBeInTheDocument()
		expect(screen.getByRole('button', { name: /Taxes/ })).toBeVisible()
	})

	it('returns the focus to the filter input after clearing', async () => {
		const user = userEvent.setup()
		renderPicker({ frequentCategories: [] })
		await user.type(screen.getByLabelText('Filter categories'), 'fue')

		await user.click(screen.getByRole('button', { name: 'Clear filter' }))

		expect(screen.getByLabelText('Filter categories')).toHaveFocus()
	})

	it('collapses the list once a category is selected', () => {
		renderPicker({ selected: { categoryID: 'category-id-2', subcategoryID: null } })

		expect(screen.getByText('Taxes')).toBeVisible()
		expect(screen.queryByLabelText('Filter categories')).not.toBeInTheDocument()
	})

	it('shows a readable name when the selected pair is not in the catalogue', () => {
		renderPicker({ selected: { categoryID: 'missing-category', subcategoryID: null, label: 'Deleted category', emojis: ['🗑'] } })

		expect(screen.getByText('Deleted category')).toBeVisible()
	})

	it('reopens the list when change is pressed, without losing the current selection', async () => {
		const user = userEvent.setup()
		renderPicker({ selected: { categoryID: 'category-id-1', subcategoryID: 'subcategory-id-1' } })

		await user.click(screen.getByRole('button', { name: 'Change' }))

		expect(screen.getByLabelText('Filter categories')).toBeVisible()
		expect(screen.getByRole('button', { name: /Private vehicles › Fuel/ })).toHaveClass('btn-info')
	})

	it('reports the leaf when a subcategory is chosen from the accordion', async () => {
		const user = userEvent.setup()
		const { onSelect } = renderPicker({ frequentCategories: [] })

		await user.click(screen.getByRole('button', { name: /Private vehicles/ }))
		await user.click(screen.getByRole('button', { name: 'Fuel' }))

		expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({
			categoryID: 'category-id-1',
			subcategoryID: 'subcategory-id-1'
		}))
	})

	it('reports the leaf when a result is chosen from the filtered flat list', async () => {
		const user = userEvent.setup()
		const { onSelect } = renderPicker({ frequentCategories: [] })

		await user.type(screen.getByLabelText('Filter categories'), 'fue')
		await user.click(screen.getByRole('button', { name: /Private vehicles › Fuel/ }))

		expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({
			categoryID: 'category-id-1',
			subcategoryID: 'subcategory-id-1'
		}))
	})

	it('reopens the list on its own when the parent clears the selection', () => {
		const { rerender } = render(
			<CategoryPicker
				categories={categories}
				frequentCategories={[]}
				selected={{ categoryID: 'category-id-2', subcategoryID: null }}
				onSelect={vi.fn()}
			/>
		)

		expect(screen.queryByLabelText('Filter categories')).not.toBeInTheDocument()

		rerender(
			<CategoryPicker
				categories={categories}
				frequentCategories={[]}
				selected={null}
				onSelect={vi.fn()}
			/>
		)

		expect(screen.getByLabelText('Filter categories')).toBeVisible()
	})

	it('renders without crashing when a category has no emojis field', async () => {
		const user = userEvent.setup()
		const categoriesWithoutEmojis = [
			{
				_id: 'category-id-3',
				name: 'No emoji category',
				uuid: 'category-uuid-3',
				subcategories: [
					{ _id: 'subcategory-id-3', name: 'No emoji subcategory', uuid: 'subcategory-uuid-3' }
				]
			}
		]

		renderPicker({ categories: categoriesWithoutEmojis, frequentCategories: [] })

		expect(screen.getByRole('button', { name: /No emoji category/ })).toBeVisible()

		await user.click(screen.getByRole('button', { name: /No emoji category/ }))

		expect(screen.getByRole('button', { name: /No emoji subcategory/ })).toBeVisible()
	})
})
