import { login } from './login'
import { logout } from './logout'
import { displayMap } from './mapBox'
import { changePassword } from './changePassword'
import { updateProfile } from './updateProfile'
import { resetPassword } from './resetPassword'
import { signUp } from './signUp'
import { showAlert } from './alert'
import { forgotPassword } from './forgotPassword'
import { bookTour } from './stripe'

window.addEventListener('DOMContentLoaded', () => {
	const loginForm = document.querySelector('#login-form')
	const signUpForm = document.querySelector('#signup-form')
	const forgotPasswordForm = document.querySelector('#forgot-password-form')
	const passwordResetForm = document.querySelector('#reset-password-form')
	const mapContainer = document.querySelector('#map')
	const logoutButton = document.querySelector('#logout')
	const bookTourBtn = document.querySelector('#book-tour')
	const passwordChangeForm = document.querySelector('#change-password')
	const updateProfileForm = document.querySelector('#update-profile')

	if (mapContainer) {
		const locations = JSON.parse(mapContainer.dataset.locations)
		displayMap(mapContainer, locations)
	}
	if (logoutButton) {
		logoutButton.addEventListener('click', async () => {
			await logout()
		})
	}

	if (loginForm) {
		loginForm.addEventListener('submit', async e => {
			e.preventDefault()
			const formData = new FormData(e.target)
			const email = formData.get('email')
			const password = formData.get('password')
			await login(email, password)
		})
	}
	if (signUpForm) {
		signUpForm.addEventListener('submit', async e => {
			e.preventDefault()
			const formInputs = e.target.querySelectorAll('input')
			const { name, email, password, passwordConfirm } = Array.from(formInputs).reduce(
				(acc, curr) => ({ ...acc, [curr.name]: curr.value }),
				{}
			)
			if (password !== passwordConfirm) {
				return showAlert('success', "Password didn't match")
			}
			await signUp(name, email, password, passwordConfirm)
		})
	}
	if (passwordChangeForm) {
		passwordChangeForm.addEventListener('submit', async e => {
			e.preventDefault()
			const currentPassword = e.target.querySelector('#password-current').value
			const password = e.target.querySelector('#password').value
			const confirmPassword = e.target.querySelector('#password-confirm').value
			await changePassword(currentPassword, password, confirmPassword)
		})
	}
	if (forgotPasswordForm) {
		forgotPasswordForm.addEventListener('submit', async e => {
			e.preventDefault()
			const email = e.target.querySelector('#email').value
			await forgotPassword(email)
		})
	}
	if (passwordResetForm) {
		const url = new URLSearchParams(window.location.search)
		const token = url.get('resetToken')
		passwordResetForm.addEventListener('submit', async e => {
			e.preventDefault()
			const formInputs = e.target.querySelectorAll('input')
			const { newPassword, confirmNewPassword } = Array.from(formInputs).reduce(
				(acc, curr) => ({
					...acc,
					[curr.name]: curr.value,
				}),
				{}
			)
			await resetPassword(token, newPassword, confirmNewPassword)
		})
	}
	if (updateProfileForm) {
		updateProfileForm.addEventListener('submit', async e => {
			e.preventDefault()
			const name = e.target.querySelector('#name').value
			const email = e.target.querySelector('#email').value
			const imageFile = e.target.querySelector('#photo').files[0]
			const formData = new FormData()

			formData.append('name', name)
			formData.append('email', email)
			formData.append('photo', imageFile)
			await updateProfile(formData)
		})
	}
	if (bookTourBtn) {
		bookTourBtn.addEventListener('click', async e => {
			bookTourBtn.innerText = 'Processing...'
			const tourId = bookTourBtn.dataset.tourid
			bookTour(tourId)
		})
	}
})
