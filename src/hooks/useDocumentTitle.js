import { useEffect } from 'react'

const APP_NAME = 'didibudget'

// Usage:
//	useDocumentTitle('Spending list')	// document.title === 'Spending list | didibudget'
//	useDocumentTitle('')			// document.title === 'didibudget'
//	useDocumentTitle(null)			// leaves document.title untouched, for a screen whose child sets it

export function useDocumentTitle(pageTitle) {
	useEffect(() => {
		if (pageTitle === null) {
			return
		}

		document.title = pageTitle ? `${pageTitle} | ${APP_NAME}` : APP_NAME
	}, [pageTitle])
}
