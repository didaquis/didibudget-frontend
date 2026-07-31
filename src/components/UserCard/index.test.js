import { render, screen } from '@testing-library/react'

import { UserCard } from './'

describe('UserCard', () => {
	it('should renders correctly and show the email of user', () => {
		const data = {
			email: 'foo@mail.com',
			isAdmin: false
		}
		render(<UserCard userData={data} />)

		expect(screen.getByText('foo@mail.com')).toBeVisible()
	})

	it('should show if user is an administrator user', () => {
		const props = {
			email: 'foo@mail.com',
			isAdmin: false
		}
		const { rerender } = render(<UserCard userData={props} />)

		expect(screen.queryByText('You are an administrator user!')).not.toBeInTheDocument()

		const newProps = {
			email: 'foo@mail.com',
			isAdmin: true
		}
		rerender(<UserCard userData={newProps} />)
		expect(screen.queryByText('You are an administrator user!')).toBeVisible()
	})
})
