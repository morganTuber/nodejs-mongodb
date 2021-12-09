import { UserModel } from '~models/user.model'
import { HttpStatus } from '~typings/http-status.enum'
import { WithUserReq } from '~typings/withUserReq'
import { catchAsync } from '~utils/catchAsync'
import { CustomError } from '~utils/customError'
import { verifyJwtAsync } from '~utils/verifyJwtAsync'

/**
 * @description Middleware to check if the user is authenticated or not
 */
export const authenticated = catchAsync<WithUserReq>(async (req, res, next) => {
	let token: string
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1]
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt
	} else {
		return next(new CustomError('You are not logged in', HttpStatus.UNAUTHORIZED))
	}
	const decoded = await verifyJwtAsync<{ _id: string; iat: number }>(token)
	const foundUser = await UserModel.findById(decoded._id)

	if (!foundUser) {
		return next(
			new CustomError('User not found or has been deleted', HttpStatus.UNAUTHORIZED)
		)
	}
	if (foundUser.isPasswordChanged(decoded.iat)) {
		return next(
			new CustomError(
				'Password has been changed, please login again',
				HttpStatus.UNAUTHORIZED
			)
		)
	}
	req.user = foundUser
	next()
})
