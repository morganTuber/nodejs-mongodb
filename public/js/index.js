import { login } from './login'
import { displayMap } from './mapBox'

window.addEventListener('DOMContentLoaded', () => {
	const loginForm = document.querySelector('.form')
	const mapContainer = document.querySelector('#map')

	if (mapContainer) {
		const locations = JSON.parse(mapContainer.dataset.locations)
		displayMap(mapContainer, locations)
	}

	if (loginForm) {
		loginForm.addEventListener('submit', e => {
			e.preventDefault()
			const formData = new FormData(e.target)
			const email = formData.get('email')
			const password = formData.get('password')
			login(email, password)
		})
	}
})
