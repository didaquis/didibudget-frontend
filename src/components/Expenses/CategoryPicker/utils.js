const buildLeaf = (category, subcategory) => {
	if (!subcategory) {
		return {
			key: category._id,
			label: category.name,
			categoryID: category._id,
			subcategoryID: null,
			emojis: category.emojis ?? []
		}
	}

	return {
		key: `${category._id}-${subcategory._id}`,
		label: `${category.name} › ${subcategory.name}`,
		categoryID: category._id,
		subcategoryID: subcategory._id,
		emojis: [...new Set([...(category.emojis ?? []), ...(subcategory.emojis ?? [])])]
	}
}

export const flattenCategories = (categories = []) => {
	const leaves = []

	categories.forEach(category => {
		if (!category.subcategories?.length) {
			leaves.push(buildLeaf(category, null))
			return
		}

		category.subcategories.forEach(subcategory => {
			leaves.push(buildLeaf(category, subcategory))
		})
	})

	return leaves.sort((one, other) => one.label.localeCompare(other.label))
}

export const filterLeaves = (leaves = [], filterText = '') => {
	const needle = filterText.trim().toLowerCase()

	if (!needle) {
		return []
	}

	return leaves.filter(leaf => leaf.label.toLowerCase().includes(needle))
}

export const isSameLeaf = (leaf, selected) => {
	if (!selected) {
		return false
	}

	return leaf.categoryID === selected.categoryID && leaf.subcategoryID === selected.subcategoryID
}
