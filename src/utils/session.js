/**
 * Save data in Session Storage
 * @param {string} name - key for data
 * @param {string} data - data to store
 */
function saveSession(name, data) {
	sessionStorage.setItem(name, data)
}

/**
 * Recover data from Session Storage
 * @param {string} name - key for data to recover
 */
function recoverSession(name) {
	return sessionStorage.getItem(name)
}

/**
 * Delete all data in Session Storage
 */
function deleteSession() {
	sessionStorage.clear()
}

/**
 * Tear down an invalidated session and send the user back to the landing page.
 * The redirect is a full page load on purpose: it drops the Apollo cache and
 * every piece of React state left over from the expired session.
 */
function forceSessionExpiry() {
	deleteSession()
	window.location.href = '/'
}

/**
 * Serialize and save user data in Session Storage
 * @param {Object} data - data to store
 */
function storeUserDataOnSessionStorage(data) {
	sessionStorage.setItem('userData', JSON.stringify(data))
}

/**
 * Recover and unserialize user data from Session Storage
 * @returns {Object}
 */
function recoverUserDataFromSessionStorage() {
	return JSON.parse(sessionStorage.getItem('userData')) || {}
}

/**
 * Delete user data in Session Storage
 */
function deleteUserDataFromSessionStorage() {
	sessionStorage.removeItem('userData')
}

export {
	saveSession,
	recoverSession,
	deleteSession,
	forceSessionExpiry,
	storeUserDataOnSessionStorage,
	recoverUserDataFromSessionStorage,
	deleteUserDataFromSessionStorage
}