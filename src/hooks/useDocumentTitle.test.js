import { renderHook } from '@testing-library/react'

import { useDocumentTitle } from './useDocumentTitle'

describe('useDocumentTitle', () => {
	it('appends the application name to the page title', () => {
		renderHook(() => useDocumentTitle('Spending list'))

		expect(document.title).toBe('Spending list | didibudget')
	})

	it('shows only the application name when there is no page title', () => {
		renderHook(() => useDocumentTitle(''))

		expect(document.title).toBe('didibudget')
	})

	it('leaves the current title alone when given null', () => {
		document.title = 'Set by someone else'

		renderHook(() => useDocumentTitle(null))

		expect(document.title).toBe('Set by someone else')
	})

	it('follows the page title when it changes', () => {
		const { rerender } = renderHook(({ title }) => useDocumentTitle(title), { initialProps: { title: 'Spending list' } })

		rerender({ title: 'Spending search' })

		expect(document.title).toBe('Spending search | didibudget')
	})
})
