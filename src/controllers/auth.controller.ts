/* eslint-disable @typescript-eslint/no-explicit-any */
import { compare } from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'

import { UserModel } from '~models/user.model'
import { HttpStatus } from '~typings/http-status.enum'
import { Role } from '~typings/role.enum'
import { IUser } from '~typings/user.interface'
import { WithUserReq } from '~typings/withUserReq'
import { catchAsync } from '~utils/catchAsync'
import { CustomError } from '~utils/customError'
import { generateJwt } from '~utils/generateJwt'
import { getEnv } from '~utils/getEnv'
import { sendEmail } from '~utils/sendEmail'

type AuthController = (req: Request, res: Response, next: NextFunction) => void

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

const createAndSendToken = <T extends { _id: string }>(user: T, res: Response) => {
	const token = generateJwt({ _id: user._id })
	res.cookie('jwt', token, {
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		expires: new Date(Date.now() + 90 * MILLISECONDS_IN_DAY),
	})
	res.json({
		status: 'Success',
		data: {
			accessToken: token,
		},
	})
}
export const signup = catchAsync(async (req, res, _next) => {
	//jwt secret key
	const {
		email,
		name,
		password,
		passwordConfirm,
		photo,
		passwordChangedAt,
		role,
		adminPassword,
	} = req.body as IUser & { adminPassword?: string }
	const newUser = await UserModel.create({
		email,
		name,
		password,
		passwordConfirm,
		photo,
		passwordChangedAt,
		role:
			adminPassword && adminPassword === getEnv('ADMIN_PASSWORD') ? role : Role.user,
	})
	createAndSendToken(newUser, res)
})
export const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body as Pick<IUser, 'email' | 'password'>
	const foundeUser = await UserModel.findOne({ email }).select('+password')

	if (foundeUser && (await compare(password, foundeUser.password))) {
		createAndSendToken(foundeUser, res)
	} else {
		next(new CustomError('Invalid username or password', 401))
	}
})
export const forgotPassword = catchAsync(async (req, res, next) => {
	const user = await UserModel.findOne({
		email: (req.body as { email: string }).email,
	})
	if (!user) {
		throw new CustomError(`User not found`, HttpStatus.NOT_FOUND)
	}
	const resetToken = user.createPasswordResetToken()
	await user.save({ validateBeforeSave: false })
	sendEmail({
		email: 'sachinaryal200@gmail.com',
		subject: 'Password Reset Request',
		text: `Please send a patch request to http://localhost:4000/api/v1/users/resetPassword/${resetToken} with new password and passwordConfirmation.If you didn't forgot your password,please ignore this email!`,
	})
		.then(() => console.info(`Successfully sent a password reset request`))
		.catch(error => console.info(error))
	res.json({
		status: 'Success',
		message: 'Password Reset Request Sent',
	})
})
export const resetPassword: AuthController = catchAsync(async (req, res, next) => {
	const passwordResetToken = req.params.resetToken
	const { newPassword, confirmNewPassword } = req.body as {
		newPassword: string
		confirmNewPassword: string
	}
	const user = await UserModel.findOne({
		passwordResetToken,
		passwordResetTokenExpiresIn: { $gt: Date.now() },
	}).select('+password')
	if (!user) {
		throw new CustomError('Token is invalid or expired', HttpStatus.UNAUTHORIZED)
	}

	user.password = newPassword
	user.passwordConfirm = confirmNewPassword
	user.passwordResetToken = undefined
	user.passwordResetTokenExpiresIn = undefined
	await user.save({ validateModifiedOnly: true })
	createAndSendToken(user, res)
})
export const changePassword = catchAsync(async (req: WithUserReq, res, next) => {
	const authenticatedUser = req.user as IUser
	const { password, confirmPassword, currentPassword } = req.body as {
		currentPassword: string
		password: string
		confirmPassword: string
	}
	try {
		const user = await UserModel.findById(authenticatedUser._id).select('+password')
		if (!user) {
			throw new CustomError('User not found', HttpStatus.NOT_FOUND)
		}
		if (await compare(currentPassword, user.password)) {
			user.password = password
			user.passwordConfirm = confirmPassword
			user.passwordChangedAt = new Date()
			await user.save({ validateModifiedOnly: true })
			createAndSendToken(user, res)
		} else {
			throw new CustomError('Invalid password', HttpStatus.UNAUTHORIZED)
		}
	} catch (error: any) {
		throw new CustomError(error, HttpStatus.UNAUTHORIZED)
	}
})
