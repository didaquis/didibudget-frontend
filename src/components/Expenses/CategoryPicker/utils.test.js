import { flattenCategories, filterLeaves, isSameLeaf, buildLeaf } from './utils'

const categories = [
	{
		_id: 'category-id-1',
		name: 'Private vehicles',
		emojis: ['🚙'],
		uuid: 'category-uuid-1',
		subcategories: [
			{ _id: 'subcategory-id-1', name: 'Fuel', uuid: 'subcategory-uuid-1', emojis: ['⛽️'] },
			{ _id: 'subcategory-id-2', name: 'Insurance', uuid: 'subcategory-uuid-2', emojis: [] }
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

describe('flattenCategories', () => {
	it('turns a category without subcategories into a single leaf', () => {
		const leaves = flattenCategories(categories)

		expect(leaves).toContainEqual({
			key: 'category-id-2',
			label: 'Taxes',
			categoryID: 'category-id-2',
			subcategoryID: null,
			emojis: ['🏛']
		})
	})

	it('turns every subcategory into its own leaf', () => {
		const leaves = flattenCategories(categories)

		expect(leaves).toContainEqual({
			key: 'category-id-1-subcategory-id-1',
			label: 'Private vehicles › Fuel',
			categoryID: 'category-id-1',
			subcategoryID: 'subcategory-id-1',
			emojis: ['🚙', '⛽️']
		})
	})

	it('sorts the leaves by label', () => {
		const labels = flattenCategories(categories).map(leaf => leaf.label)

		expect(labels).toStrictEqual([
			'Private vehicles › Fuel',
			'Private vehicles › Insurance',
			'Taxes'
		])
	})

	it('returns an empty list when there are no categories', () => {
		expect(flattenCategories([])).toStrictEqual([])
	})
})

describe('filterLeaves', () => {
	const leaves = flattenCategories(categories)

	it('matches the name of a subcategory ignoring case', () => {
		const result = filterLeaves(leaves, 'fue')

		expect(result.map(leaf => leaf.label)).toStrictEqual(['Private vehicles › Fuel'])
	})

	it('matches the name of a category', () => {
		const result = filterLeaves(leaves, 'taxes')

		expect(result.map(leaf => leaf.label)).toStrictEqual(['Taxes'])
	})

	it('returns nothing when the filter is empty', () => {
		expect(filterLeaves(leaves, '   ')).toStrictEqual([])
	})
})

describe('buildLeaf', () => {
	it('builds a leaf for a category without a subcategory', () => {
		const category = { _id: 'category-id-2', name: 'Taxes', emojis: ['🏛'] }

		expect(buildLeaf(category, null)).toStrictEqual({
			key: 'category-id-2',
			label: 'Taxes',
			categoryID: 'category-id-2',
			subcategoryID: null,
			emojis: ['🏛']
		})
	})

	it('defaults missing emojis to an empty array', () => {
		const category = { _id: 'category-id-3', name: 'No emojis' }

		expect(buildLeaf(category, null).emojis).toStrictEqual([])
	})

	it('merges category and subcategory emojis without repeats', () => {
		const category = { _id: 'category-id-1', name: 'Private vehicles', emojis: ['🚙'] }
		const subcategory = { _id: 'subcategory-id-1', name: 'Fuel', emojis: ['🚙', '⛽️'] }

		expect(buildLeaf(category, subcategory)).toStrictEqual({
			key: 'category-id-1-subcategory-id-1',
			label: 'Private vehicles › Fuel',
			categoryID: 'category-id-1',
			subcategoryID: 'subcategory-id-1',
			emojis: ['🚙', '⛽️']
		})
	})
})

describe('isSameLeaf', () => {
	const leaf = { key: 'a', label: 'a', categoryID: 'category-id-1', subcategoryID: 'subcategory-id-1', emojis: [] }

	it('is true when both identifiers match', () => {
		expect(isSameLeaf(leaf, { categoryID: 'category-id-1', subcategoryID: 'subcategory-id-1' })).toBe(true)
	})

	it('is false when the subcategory differs', () => {
		expect(isSameLeaf(leaf, { categoryID: 'category-id-1', subcategoryID: 'subcategory-id-2' })).toBe(false)
	})

	it('is false when nothing is selected', () => {
		expect(isSameLeaf(leaf, null)).toBe(false)
	})
})
