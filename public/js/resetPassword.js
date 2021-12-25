import { showAlert } from './alert.js'
import axios from 'axios'

/**
 *
 * @param {string} token
 * @param {string} newPassword
 * @param {string} confirmNewPassword
 */
export const resetPassword = async (token, newPassword, confirmNewPassword) => {
	try {
		const response = await axios.post(`/api/v1/users/resetPassword/${token}`, {
			newPassword,
			confirmNewPassword,
		})
		if (response.status === 200) {
			showAlert('success', 'Password changed successfully')
			setTimeout(() => (window.location.href = '/login'), 2000)
		}
	} catch (error) {
		showAlert('error', error.response.data.message)
	}
}
