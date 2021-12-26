import { bookingModel } from '~models/booking.model'
import { TourModel } from '~models/tour.model'
import { HttpStatus } from '~typings/http-status.enum'
import { WithUserReq } from '~typings/withUserReq'
import { catchAsync } from '~utils/catchAsync'
import { CustomError } from '~utils/customError'

interface OrderSuccessQuery {
	tour: string
}

export const getOverView = catchAsync(async (req, res, next) => {
	const tours = await TourModel.find()
	res.render('overview', {
		title: 'All Tours',
		tours,
	})
})
export const getTour = catchAsync(async (req, res, next) => {
	const { slug } = req.params
	const tour = await TourModel.findOne({ slug }).populate({
		path: 'reviews',
		fields: 'review rating user',
	})
	if (!tour) {
		return next(new CustomError(`Tour not found`, HttpStatus.NOT_FOUND))
	}
	res.render('tour', {
		title: tour.name,
		tour,
	})
})

export const loginForm = catchAsync(async (req, res, next) => {
	res.render('login', {
		title: 'Login to your account',
	})
})

export const signupForm = catchAsync(async (req, res, next) => {
	res.render('signup', {
		title: 'Create a new account',
	})
})
export const getAccount = catchAsync(async (req: WithUserReq, res, next) => {
	const user = req.user
	res.render('account', {
		title: 'Your profile',
		user,
	})
})
export const forgotPasswordForm = catchAsync(async (req, res, next) => {
	res.render('forgotPassword', {
		title: 'Forgot Password',
	})
})
export const resetPasswordForm = catchAsync(async (req, res, next) => {
	res.render('resetPassword', {
		title: 'Reset Password',
	})
})
export const orderSuccessPage = catchAsync(async (req, res, next) => {
	//create a new booking once the user visits the success page
	const { tour } = req.query as unknown as OrderSuccessQuery
	if (!tour) return next()
	res.render('success', {
		title: 'Order Success',
		tour,
	})
})
export const userBookingsPage = catchAsync(async (req: WithUserReq, res, next) => {
	const bookings = await bookingModel.find({ user: req.user?._id })
	const tours = bookings.map(booking => booking.tour)
	res.render('bookings', {
		title: 'Your Bookings',
		tours,
	})
})
