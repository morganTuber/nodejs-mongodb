import axios from 'axios'
import { showAlert } from './alert'
/**
 *
 * @param {string} email
 * @param {string} password
 */
export const login = async (email, password) => {
	try {
		const res = await axios.post('/api/v1/users/login', { email, password })
		if (res.data.status === 'Success') {
			showAlert('success', 'Successfully logged in')
			const url = new URL(window.location.href)
			const redirect = url.searchParams.get('redirect')
			if (redirect) {
				return (window.location.href = redirect)
			}
			window.location.href = '/'
		}
	} catch (error) {
		showAlert('error', error.response.data.message)
	}
}
