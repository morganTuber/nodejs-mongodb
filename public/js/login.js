import { showAlert } from './alert'
/**
 *
 * @param {string} email
 * @param {string} password
 */
export const login = async (email, password) => {
	const res = await fetch('/api/v1/users/login', {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	})
	if (res.ok) {
		showAlert('success', 'Login Successful')
		setTimeout(() => {
			window.location.href = '/'
		}, 2000)
	} else {
		showAlert('error', 'Login failed.Please double check your username and password.')
	}
}
