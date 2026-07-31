import { ApolloLink, Observable, execute, gql } from '@apollo/client'

import { authMiddleware, errorLink } from './config'
import { recoverSession, forceSessionExpiry } from '../utils/session'

vi.mock('../utils/session', () => ({
	recoverSession: vi.fn(),
	forceSessionExpiry: vi.fn(),
	deleteSession: vi.fn()
}))

const A_QUERY = gql`
	query GetSomething {
		something
	}
`

/**
 * Run an operation through the link under test and resolve once it settles,
 * reporting whatever reached the subscriber.
 */
const runThrough = (linkUnderTest, terminatingLink, context = {}) => {
	return new Promise((resolve) => {
		const results = []

		execute(ApolloLink.from([linkUnderTest, terminatingLink]), { query: A_QUERY, context }).subscribe({
			next: (result) => results.push(result),
			error: (networkError) => resolve({ results, networkError }),
			complete: () => resolve({ results, networkError: null })
		})
	})
}

const respondWith = (result) => new ApolloLink(() => Observable.of(result))

const failWith = (networkError) => new ApolloLink(() => new Observable((observer) => observer.error(networkError)))

describe('apollo links', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('authMiddleware', () => {
		const captureHeaders = () => {
			const captured = {}
			const link = new ApolloLink((operation) => {
				captured.headers = operation.getContext().headers
				return Observable.of({ data: {} })
			})

			return { link, captured }
		}

		it('sends the stored token as a bearer credential', async () => {
			recoverSession.mockReturnValue('a-jwt')
			const { link, captured } = captureHeaders()

			await runThrough(authMiddleware, link)

			expect(captured.headers.authorization).toBe('Bearer a-jwt')
		})

		it('sends an empty credential when there is no session', async () => {
			recoverSession.mockReturnValue(null)
			const { link, captured } = captureHeaders()

			await runThrough(authMiddleware, link)

			expect(captured.headers.authorization).toBe('')
		})

		it('keeps headers that were already in the context', async () => {
			recoverSession.mockReturnValue('a-jwt')
			const { link, captured } = captureHeaders()

			await runThrough(authMiddleware, link, { headers: { 'accept-language': 'ca' } })

			expect(captured.headers['accept-language']).toBe('ca')
		})
	})

	describe('errorLink', () => {
		const graphQLErrorWith = (code) => respondWith({ errors: [{ message: 'Original message', extensions: { code } }] })

		it('expires the session when the backend rejects the credentials', async () => {
			await runThrough(errorLink, graphQLErrorWith('UNAUTHENTICATED'))

			expect(forceSessionExpiry).toHaveBeenCalled()
		})

		it('expires the session when the backend forbids the operation', async () => {
			await runThrough(errorLink, graphQLErrorWith('FORBIDDEN'))

			expect(forceSessionExpiry).toHaveBeenCalled()
		})

		it('hides the details of a server error behind a generic message', async () => {
			const { results } = await runThrough(errorLink, graphQLErrorWith('INTERNAL_SERVER_ERROR'))

			expect(results[0].errors[0].message).toBe('An error has occurred')
		})

		it('keeps the user signed in when the server fails', async () => {
			await runThrough(errorLink, graphQLErrorWith('INTERNAL_SERVER_ERROR'))

			expect(forceSessionExpiry).not.toHaveBeenCalled()
		})

		it('leaves any other error untouched', async () => {
			const { results } = await runThrough(errorLink, graphQLErrorWith('BAD_USER_INPUT'))

			expect(results[0].errors[0].message).toBe('Original message')
			expect(forceSessionExpiry).not.toHaveBeenCalled()
		})

		it('expires the session when the transport reports an invalid token', async () => {
			await runThrough(errorLink, failWith(Object.assign(new Error('Failed to fetch'), { response: 'invalid_token' })))

			expect(forceSessionExpiry).toHaveBeenCalled()
		})

		it('keeps the user signed in when the network simply fails', async () => {
			await runThrough(errorLink, failWith(new Error('Failed to fetch')))

			expect(forceSessionExpiry).not.toHaveBeenCalled()
		})
	})
})
