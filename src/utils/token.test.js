import { decodeToken } from './token'

const toBase64Url = (obj) => btoa(JSON.stringify(obj))
	.replace(/\+/g, '-')
	.replace(/\//g, '_')
	.replace(/=+$/, '')

const makeToken = (payload) => `aGVhZGVy.${toBase64Url(payload)}.c2lnbmF0dXJl`

describe('decodeToken', () => {
	test('should return the decoded payload for a valid token', () => {
		const payload = { email: 'example@mail.com', isAdmin: true, isActive: true, uuid: 'abc-123' }

		const result = decodeToken(makeToken(payload))

		expect(result).toEqual(payload)
	})

	test('should return an empty object for a malformed token', () => {
		const result = decodeToken('not-a-jwt')

		expect(result).toEqual({})
	})

	test('should return an empty object for null or undefined', () => {
		expect(decodeToken(null)).toEqual({})
		expect(decodeToken(undefined)).toEqual({})
	})
})
