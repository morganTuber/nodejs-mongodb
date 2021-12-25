import { Router } from 'express'

import {
	createBooking,
	deleteBooking,
	getAllBookings,
	getCheckoutSession,
	updateBooking,
} from '~controllers/booking.controller'
import { authenticated } from '~middlewares/authenticated'
import { filterUserBookings } from '~middlewares/filterUserBookings'
import { restrictTo } from '~middlewares/restrictTo'
import { Role } from '~typings/role.enum'

const bookingRouter = Router()

bookingRouter.get(
	'/',
	authenticated,
	restrictTo(Role.admin, Role['lead-guide']),
	getAllBookings
)
bookingRouter.post('/', authenticated, restrictTo(Role.user), createBooking)
bookingRouter.patch('/', authenticated, restrictTo(Role.user), updateBooking)
bookingRouter.delete('/:id', authenticated, restrictTo(Role.user), deleteBooking)

bookingRouter.get(
	'/my-bookings',
	authenticated,
	restrictTo(Role.user),
	filterUserBookings,
	getAllBookings
)
bookingRouter.get('/checkout-session/:tourId', authenticated, getCheckoutSession)

export default bookingRouter
