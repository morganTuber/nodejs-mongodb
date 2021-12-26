import Stripe from 'stripe'

import {
	createDocument,
	deleteDocument,
	getAllDocuments,
	updateDocument,
} from '~controllers/factory.handler'
import { bookingModel } from '~models/booking.model'
import { TourModel } from '~models/tour.model'
import { HttpStatus } from '~typings/http-status.enum'
import { WithUserReq } from '~typings/withUserReq'
import { catchAsync } from '~utils/catchAsync'
import { CustomError } from '~utils/customError'
import { getEnv } from '~utils/getEnv'
import { sendResponse } from '~utils/sendResponse'

export const getCheckoutSession = catchAsync(async (req: WithUserReq, res, next) => {
	const stripe = new Stripe(getEnv('STRIPE_SECRET_KEY'), { apiVersion: '2020-08-27' })
	// get currently booked tour
	const tour = await TourModel.findById(req.params.tourId)
	if (!tour) {
		return next(new CustomError('Tour Not Found', HttpStatus.NOT_FOUND))
	}
	const successQuery = `?tour=${tour.name}&tourId=${tour.id}&userId=${req.user?._id}&price=${tour.price}`
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		success_url: `${req.protocol}://${req.get('host')}/success${successQuery}`,
		cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
		customer_email: req.user?.email,
		client_reference_id: req.params.tourId,
		line_items: [
			{
				name: `${tour.name} Tour`,
				description: tour.summary,
				currency: 'usd',
				amount: tour.price * 100,
				quantity: 1,
				images: [
					`https://morning-ridge-48586.herokuapp.com/img/tours/${tour.imageCover}`,
				],
			},
		],
	})
	sendResponse({
		res,
		statusCode: 200,
		data: { session },
	})
})
export const createBooking = createDocument(bookingModel)
export const getAllBookings = getAllDocuments(bookingModel)
export const updateBooking = updateDocument(bookingModel)
export const deleteBooking = deleteDocument(bookingModel)
