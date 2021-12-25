import { UserModel } from '~models/user.model'
import { catchAsync } from '~utils/catchAsync'
import { verifyJwtAsync } from '~utils/verifyJwtAsync'

/**
 * @description Middleware to check if user is logged in
 */
export const isLoggedIn = catchAsync(async (req, res, next) => {
	//only check if a user is logged in or not if the request is made from browser
	if (!req.originalUrl.startsWith('/api') && req.cookies.jwt) {
		const token = req.cookies.jwt as string
		const decoded = await verifyJwtAsync<{ _id: string; iat: number }>(token)

		const loggedInUser = await UserModel.findById(decoded._id)
		if (!loggedInUser) {
			return next()
		}
		if (loggedInUser.isPasswordChanged(decoded.iat)) {
			return next()
		}
		res.locals.user = loggedInUser
		return next()
	}
	next()
})
