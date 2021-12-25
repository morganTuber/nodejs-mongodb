import axios from 'axios'
import { showAlert } from './alert'

const STRIPE_PUBLIC_KEY =
	'pk_test_51KAB9XCO8m1gZ84iEwOb7tJiPsKI22FKxVfRZ6ekhK42IEEKdA1MQP2TfX28p3VEmzfobhk3BPg0JJChGQaTdh1Z00XMoPAOFv'
const stripe = new Stripe(STRIPE_PUBLIC_KEY)
/**
 *
 * @param {string} tourId
 */
export const bookTour = async tourId => {
	try {
		const response = await axios.get(`/api/v1/bookings/checkout-session/${tourId}`)
		const session = response.data.data.session
		if (session) {
			const result = await stripe.redirectToCheckout({
				sessionId: session.id,
			})
			if (!result.error) {
				window.location.href = window.location.href.split('?')[0]
			}
		}
	} catch (error) {
		showAlert('error', error.response.data.message)
	}
}
