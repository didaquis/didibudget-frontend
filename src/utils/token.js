import { jwtDecode } from 'jwt-decode'

/**
 * Decode the payload of a JWT without verifying its signature.
 * Signature verification is the backend's responsibility; the client only
 * needs to read the claims. Returns an empty object for missing or malformed
 * tokens so callers can safely destructure the result.
 * @param {string} token - The JWT to decode
 * @returns {Object} The decoded payload, or an empty object if the token is invalid
 */
const decodeToken = (token) => {
	try {
		return jwtDecode(token)
	} catch {
		return {}
	}
}

export { decodeToken }
