import axios from 'axios'
import { showAlert } from './alert'
/**
 *
 * @param {FormData} formData
 */
export const updateProfile = async formData => {
	try {
		const response = await axios.patch('/api/v1/users/update-profile', formData)
		if (response.data.status === 'Success') {
			showAlert('success', 'Successfully updated profile')
			setTimeout(() => window.location.reload(), 2000)
		}
	} catch (error) {
		showAlert(error.response.data.message)
	}
}
