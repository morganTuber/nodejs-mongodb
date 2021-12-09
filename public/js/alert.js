/**
 * Shows an alert message
 * @param {"success"|"error"} type
 * @param {string} message
 */
export const showAlert = (type, message) => {
	hideAlert()
	const markup = `<p class="alert alert--${type}">${message}</p>`
	document.querySelector('body').insertAdjacentHTML('afterbegin', markup)
	// setTimeout(hideAlert, 3000)
}

const hideAlert = () => {
	const alertContainer = document.querySelector('.alert')
	alertContainer && alertContainer.remove()
}
