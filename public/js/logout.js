import { showAlert } from './alert'
export const logout = async () => {
	const prompt = confirm('Are you sure you want to logout?')
	if (prompt) {
		try {
			const response = await fetch('/api/v1/users/logout')
			if (response.ok) {
				showAlert('success', 'You have been logged out')
				window.location.reload()
			}
		} catch (error) {
			showAlert('error', error.message)
		}
	}
}
