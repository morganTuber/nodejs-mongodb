import { NextFunction, Request, Response } from 'express'
import Stripe from 'stripe'

import {
	createDocument,
	deleteDocument,
	getAllDocuments,
	updateDocument,
} from '~controllers/factory.handler'
import { bookingModel } from '~models/booking.model'
import { TourModel } from '~models/tour.model'
import { UserModel } from '~models/user.model'
import { HttpStatus } from '~typings/http-status.enum'
import { WithUserReq } from '~typings/withUserReq'
import { catchAsync } from '~utils/catchAsync'
import { CustomError } from '~utils/customError'
import { getEnv } from '~utils/getEnv'
import { sendResponse } from '~utils/sendResponse'

interface StripeSession {
	client_reference_id: string
	customer_email: string
	amount_total: number
}

const stripe = new Stripe(getEnv('STRIPE_SECRET_KEY'), { apiVersion: '2020-08-27' })
let event: Stripe.Event

export const getCheckoutSession = catchAsync(async (req: WithUserReq, res, next) => {
	// get currently booked tour
	const tour = await TourModel.findById(req.params.tourId)
	if (!tour) {
		return next(new CustomError('Tour Not Found', HttpStatus.NOT_FOUND))
	}
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		success_url: `${req.protocol}://${req.get('host')}/my-bookings`,
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
const createStripeCheckout = async (session: StripeSession, next: NextFunction) => {
	const { client_reference_id: tour, amount_total, customer_email } = session
	const user = await UserModel.findOne({ email: customer_email })
	if (!user) return next(new CustomError('User not found', HttpStatus.NOT_FOUND))
	await bookingModel.create({
		tour,
		user: user._id,
		price: amount_total / 100,
	})
}
export const webhookCheckout = async (req: Request, res: Response, next: NextFunction) => {
	const signature = req.headers['stripe-signature'] as string
	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			signature,
			getEnv('STRIPE_WEBHOOK_SECRET')
		)
	} catch (error) {
		res.status(400).json(error)
	}
	if (event.type === 'checkout.session.completed') {
		await createStripeCheckout(event.data.object as StripeSession, next)
	}
	res.status(200).json({ received: true })
}
export const createBooking = createDocument(bookingModel)
export const getAllBookings = getAllDocuments(bookingModel)
export const updateBooking = updateDocument(bookingModel)
export const deleteBooking = deleteDocument(bookingModel)
