import { useContext } from 'react'
import { renderHook, act } from '@testing-library/react'

import Auth, { AuthContext } from './AuthContext'

const toBase64Url = (obj) => btoa(JSON.stringify(obj))
	.replace(/\+/g, '-')
	.replace(/\//g, '_')
	.replace(/=+$/, '')

const makeToken = (payload) => `aGVhZGVy.${toBase64Url(payload)}.c2lnbmF0dXJl`

const anAdmin = {
	email: 'admin@mail.com',
	isAdmin: true,
	isActive: true,
	registrationDate: 1715776800000,
	uuid: 'abc-123'
}

const renderAuth = () => renderHook(() => useContext(AuthContext), { wrapper: Auth.Provider })

describe('AuthContext', () => {
	beforeEach(() => {
		sessionStorage.clear()
	})

	it('starts signed out when there is no stored session', () => {
		const { result } = renderAuth()

		expect(result.current.isAuth).toBeFalsy()
		expect(result.current.userData).toEqual({})
	})

	it('signs the user in with the claims carried by the token', () => {
		const { result } = renderAuth()

		act(() => result.current.activateAuth(makeToken(anAdmin)))

		expect(result.current.isAuth).toBe(true)
		expect(result.current.userData.email).toBe('admin@mail.com')
		expect(result.current.userData.isAdmin).toBe(true)
		expect(result.current.userData.uuid).toBe('abc-123')
	})

	it('keeps the session across a page reload', () => {
		const { result, unmount } = renderAuth()
		act(() => result.current.activateAuth(makeToken(anAdmin)))
		unmount()

		const { result: afterReload } = renderAuth()

		expect(afterReload.current.isAuth).toBeTruthy()
		expect(afterReload.current.userData.email).toBe('admin@mail.com')
	})

	it('still recognises an admin after a page reload', () => {
		const { result, unmount } = renderAuth()
		act(() => result.current.activateAuth(makeToken(anAdmin)))
		unmount()

		const { result: afterReload } = renderAuth()

		expect(afterReload.current.userData.isAdmin).toBe(true)
	})

	it('does not hand out admin rights to a regular user after a reload', () => {
		const { result, unmount } = renderAuth()
		act(() => result.current.activateAuth(makeToken({ ...anAdmin, isAdmin: false })))
		unmount()

		const { result: afterReload } = renderAuth()

		expect(afterReload.current.userData.isAdmin).toBe(false)
	})

	it('signs the user out and forgets everything about them', () => {
		const { result } = renderAuth()
		act(() => result.current.activateAuth(makeToken(anAdmin)))

		act(() => result.current.removeAuth())

		expect(result.current.isAuth).toBe(false)
		expect(result.current.userData).toEqual({})
		expect(sessionStorage.getItem('token')).toBeNull()
		expect(sessionStorage.getItem('userData')).toBeNull()
	})

	it('does not blow up on a token it cannot read', () => {
		const { result } = renderAuth()

		act(() => result.current.activateAuth('not-a-jwt'))

		expect(result.current.userData.email).toBeUndefined()
	})

	it('keeps the registration date unchanged once the session is reloaded', () => {
		const { result, unmount } = renderAuth()
		act(() => result.current.activateAuth(makeToken(anAdmin)))
		expect(result.current.userData.registrationDate).toBe(1715776800000)
		unmount()

		const { result: afterReload } = renderAuth()

		expect(afterReload.current.userData.registrationDate).toBe(1715776800000)
	})
})
