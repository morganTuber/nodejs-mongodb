import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import { pick } from 'lodash'
import { promisify } from 'util'

import { UserModel } from '~models/user.model'
import { HttpStatus } from '~typings/http-status.enum'
import { IUser } from '~typings/user.interface'
import { WithUserReq } from '~typings/withUserReq'
import { catchAsync } from '~utils/catchAsync'
import { CustomError } from '~utils/customError'
import { getEnv } from '~utils/getEnv'

type AuthController = (req: WithUserReq, res: Response, next: NextFunction) => void
export type JwtVerify = (token: string, secret: string) => Promise<jwt.JwtPayload>

export const authenticated: AuthController = catchAsync<WithUserReq>(
	async (req, res, next) => {
		if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
			const JWT_SECRET = getEnv('JWT_SECRET_KEY')
			const jwtToken = req.headers.authorization.split(' ')[1]

			const decoded = await (promisify(jwt.verify) as JwtVerify)(jwtToken, JWT_SECRET)

			const foundUser = await UserModel.findById(decoded._id)

			if (!foundUser) {
				throw new CustomError(
					`User doesn't exist or has been deleted`,
					HttpStatus.FORBIDDEN
				)
			}
			if (foundUser.isPasswordChanged(decoded.iat as number)) {
				throw new CustomError(
					`Unauthroized request.Please try logging back`,
					HttpStatus.UNAUTHORIZED
				)
			}

			const user = pick(foundUser, [
				'_id',
				'name',
				'email',
				'photo',
				'password',
				'passwordConfirm',
				'passwordChangedAt',
				'role',
			]) as IUser
			req.user = user
			next()
		} else {
			throw new CustomError(
				`You are not logged in.Please login and try again`,
				HttpStatus.UNAUTHORIZED
			)
		}
	}
)
