import axios from 'axios'
import { showAlert } from './alert'

/**
 * Change currently logged in user password
 * @param {string} currentPassword
 * @param {string} password
 * @param {string} confirmPassword
 */
export const changePassword = async (currentPassword, password, confirmPassword) => {
	try {
		const response = await axios.post('/api/v1/users/change-password', {
			confirmPassword,
			password,
			currentPassword,
		})
		if (response.status === 200) {
			showAlert('success', 'Successfully changed password')
			window.location.reload()
		}
	} catch (error) {
		showAlert('error', error.response.data.message)
	}
}
