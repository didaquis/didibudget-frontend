import {
	saveSession,
	recoverSession,
	deleteSession,
	forceSessionExpiry,
	storeUserDataOnSessionStorage,
	recoverUserDataFromSessionStorage,
	deleteUserDataFromSessionStorage
} from './session'

describe('session', () => {
	beforeEach(() => {
		sessionStorage.clear()
	})

	describe('raw values', () => {
		it('reads back a value that was stored', () => {
			saveSession('token', 'a-jwt')

			expect(recoverSession('token')).toBe('a-jwt')
		})

		it('returns null for a key that was never stored', () => {
			expect(recoverSession('token')).toBeNull()
		})

		it('wipes every stored value', () => {
			saveSession('token', 'a-jwt')
			storeUserDataOnSessionStorage({ email: 'example@mail.com' })

			deleteSession()

			expect(recoverSession('token')).toBeNull()
			expect(sessionStorage.getItem('userData')).toBeNull()
		})
	})

	describe('user data', () => {
		it('keeps booleans as booleans across a store and recover cycle', () => {
			storeUserDataOnSessionStorage({ isAdmin: false, isActive: true })

			const recovered = recoverUserDataFromSessionStorage()

			expect(recovered.isAdmin).toBe(false)
			expect(recovered.isActive).toBe(true)
		})

		it('grants admin only to a user stored as an admin', () => {
			storeUserDataOnSessionStorage({ isAdmin: true })

			expect(recoverUserDataFromSessionStorage().isAdmin).toBe(true)
		})

		it('keeps strings untouched', () => {
			storeUserDataOnSessionStorage({ email: 'example@mail.com', uuid: 'abc-123' })

			const recovered = recoverUserDataFromSessionStorage()

			expect(recovered.email).toBe('example@mail.com')
			expect(recovered.uuid).toBe('abc-123')
		})

		it('keeps numbers as numbers across a store and recover cycle', () => {
			storeUserDataOnSessionStorage({ registrationDate: 1715776800000 })

			expect(recoverUserDataFromSessionStorage().registrationDate).toBe(1715776800000)
		})

		it('keeps a string that reads like a boolean as a string', () => {
			storeUserDataOnSessionStorage({ email: 'true' })

			expect(recoverUserDataFromSessionStorage().email).toBe('true')
		})

		it('returns an empty object when nothing was stored', () => {
			expect(recoverUserDataFromSessionStorage()).toEqual({})
		})

		it('drops the user data without touching the token', () => {
			saveSession('token', 'a-jwt')
			storeUserDataOnSessionStorage({ email: 'example@mail.com' })

			deleteUserDataFromSessionStorage()

			expect(recoverUserDataFromSessionStorage()).toEqual({})
			expect(recoverSession('token')).toBe('a-jwt')
		})
	})

	describe('forceSessionExpiry', () => {
		const originalLocation = window.location

		beforeEach(() => {
			Object.defineProperty(window, 'location', {
				configurable: true,
				writable: true,
				value: { href: '/spending/list' }
			})
		})

		afterEach(() => {
			Object.defineProperty(window, 'location', {
				configurable: true,
				writable: true,
				value: originalLocation
			})
		})

		it('wipes the session', () => {
			saveSession('token', 'a-jwt')
			storeUserDataOnSessionStorage({ email: 'example@mail.com' })

			forceSessionExpiry()

			expect(recoverSession('token')).toBeNull()
			expect(recoverUserDataFromSessionStorage()).toEqual({})
		})

		it('sends the user back to the landing page', () => {
			forceSessionExpiry()

			expect(window.location.href).toBe('/')
		})
	})
})
