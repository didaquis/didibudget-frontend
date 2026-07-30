import { Fragment } from 'react'

import { ErrorAlert } from '../components/ErrorAlert'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export const Page404 = () => {
	useDocumentTitle('Page not found')

	return (
		<Fragment>
			<ErrorAlert errorMessage='404' />
		</Fragment>
	)
}