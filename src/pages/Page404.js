import { Fragment } from 'react'
import { Link } from 'react-router'

import { PageTitle } from '../components/PageTitle'

export const Page404 = () => (
	<Fragment>
		<PageTitle text='Page not found' />
		<p className="text-light">The page you are looking for does not exist or has been moved.</p>
		<Link to='/' className="btn btn-outline-info">Go to the home page</Link>
	</Fragment>
)
