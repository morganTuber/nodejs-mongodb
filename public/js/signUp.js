import axios from 'axios'
import { showAlert } from './alert'

/**
 *
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {string} passwordConfirm
 */
export const signUp = async (name, email, password, passwordConfirm) => {
	try {
		const response = await axios.post('/api/v1/users/signup', {
			name,
			email,
			password,
			passwordConfirm,
		})
		if (response.status === 200) {
			showAlert('success', 'Succesfully created a new account')
			setTimeout(() => (window.location.href = '/'), 2000)
		}
	} catch (error) {
		showAlert('error', error.response.data.message)
	}
}
