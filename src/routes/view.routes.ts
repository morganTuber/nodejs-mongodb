import { Router } from 'express'

import {
	forgotPasswordForm,
	getAccount,
	getOverView,
	getTour,
	loginForm,
	orderSuccessPage,
	resetPasswordForm,
	signupForm,
	userBookingsPage,
} from '~controllers/view.controller'
import { authenticated } from '~middlewares/authenticated'
import { isLoggedIn } from '~middlewares/isLoggedIn'

const viewsRouter = Router()

viewsRouter.use(isLoggedIn)

viewsRouter.get('/', getOverView)
viewsRouter.get('/tour/:slug', getTour)
viewsRouter.get('/login', loginForm)
viewsRouter.get('/signup', signupForm)
viewsRouter.get('/forgot-password', forgotPasswordForm)
viewsRouter.get('/reset-password', resetPasswordForm)
viewsRouter.get('/account', authenticated, getAccount)
viewsRouter.get('/success', authenticated, orderSuccessPage)
viewsRouter.get('/my-bookings', authenticated, userBookingsPage)

export default viewsRouter
