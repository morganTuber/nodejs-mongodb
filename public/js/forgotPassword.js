import axios from 'axios'
import { showAlert } from './alert'

/**
 *
 * @param {string} email
 */
export const forgotPassword = async email => {
	try {
		const response = await axios.post('/api/v1/users/forgotPassword', { email })
		if (response.status === 200) {
			showAlert('success', response.data.message)
		}
	} catch (error) {
		showAlert('error', error.response.data.message)
	}
}
