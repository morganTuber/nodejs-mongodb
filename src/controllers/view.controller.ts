import { TourModel } from '~models/tour.model'
import { catchAsync } from '~utils/catchAsync'

export const getOverView = catchAsync(async (req, res, next) => {
	const tours = await TourModel.find()
	res.render('overview', {
		title: 'All Tours',
		tours,
	})
})
export const getTour = catchAsync(async (req, res, next) => {
	const { slug } = req.params
	console.info(`The slug is ${slug}`)
	const tour = await TourModel.findOne({ slug }).populate({
		path: 'reviews',
		fields: 'review rating user',
	})
	if (!tour) {
		return res.redirect('/')
	}
	res.set(
		'Content-Security-Policy',
		"default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
	).render('tour', {
		title: tour.name,
		tour,
	})
})

export const loginForm = catchAsync(async (req, res, next) => {
	res.render('login', {
		title: 'Login to your account',
	})
})
