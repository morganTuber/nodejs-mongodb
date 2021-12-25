/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express'

import { UserModel } from '~models/user.model'
import { HttpStatus } from '~typings/http-status.enum'
import { Role } from '~typings/role.enum'
import { IUser } from '~typings/user.interface'
import { WithUserReq } from '~typings/withUserReq'
import { catchAsync } from '~utils/catchAsync'
import { CustomError } from '~utils/customError'
import { Email } from '~utils/email'
import { generateJwt } from '~utils/generateJwt'
import { getEnv } from '~utils/getEnv'

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000

const createAndSendToken = <T extends { _id: string }>(user: T, res: Response) => {
	const token = generateJwt({ _id: user._id })
	res.cookie('jwt', token, {
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		//set the expiration date of jwt cookie to 90 days
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
		//if the request contains adminPassword and if the admin password is correct then user role is set as admin else it is set as user
		role: adminPassword && adminPassword === getEnv('ADMIN_PASSWORD') ? role : Role.user,
	})
	const url = `${req.protocol}://${req.get('host')}/account`
	await new Email(newUser, url).welcome()
	createAndSendToken(newUser, res)
})
export const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body as Pick<IUser, 'email' | 'password'>
	const foundeUser = await UserModel.findOne({ email }).select('+password')

	if (foundeUser && (await foundeUser.comparePassword(password, foundeUser.password))) {
		return createAndSendToken(foundeUser, res)
	}
	return next(new CustomError('Invalid username or password', HttpStatus.UNAUTHORIZED))
})
export const forgotPassword = catchAsync(async (req, res, next) => {
	const user = await UserModel.findOne({
		email: req.body.email,
	})
	if (!user) {
		return next(new CustomError(`User not found`, HttpStatus.NOT_FOUND))
	}
	const resetToken = user.createPasswordResetToken()
	await user.save({ validateModifiedOnly: true })
	const url = `${req.protocol}://${req.get('host')}/reset-password?resetToken=${resetToken}`
	await new Email(user, url).forgotPassword()
	res.json({
		status: 'Success',
		message: 'Please check your email for password reset link',
	})
})
export const resetPassword = catchAsync(async (req, res, next) => {
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
		return next(new CustomError('Token is invalid or expired', HttpStatus.UNAUTHORIZED))
	}

	user.password = newPassword
	user.passwordConfirm = confirmNewPassword
	user.passwordChangedAt = new Date()
	user.passwordResetToken = undefined
	user.passwordResetTokenExpiresIn = undefined
	await user.save({ validateModifiedOnly: true })
	createAndSendToken(user, res)
})
export const changePassword = catchAsync(async (req: WithUserReq, res, next) => {
	const authenticatedUser = req.user as Required<IUser>
	const { password, confirmPassword, currentPassword } = req.body as {
		currentPassword: string
		password: string
		confirmPassword: string
	}

	const user = await UserModel.findById(authenticatedUser._id).select('+password')
	if (!user) {
		return next(new CustomError('User not found', HttpStatus.NOT_FOUND))
	}
	if (await user.comparePassword(currentPassword, user.password)) {
		user.password = password
		user.passwordConfirm = confirmPassword
		user.passwordChangedAt = new Date()
		await user.save({ validateModifiedOnly: true })
		createAndSendToken(user, res)
	} else {
		return next(new CustomError('Invalid password', HttpStatus.UNAUTHORIZED))
	}
})

export const logout = catchAsync(async (req, res, next) => {
	res.clearCookie('jwt')
	res.json({
		status: 'success',
	})
})
