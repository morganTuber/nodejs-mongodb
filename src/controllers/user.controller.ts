/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserModel } from '~models/user.model'
import { HttpStatus } from '~typings/http-status.enum'
import { IUser } from '~typings/user.interface'
import { WithUserReq } from '~typings/withUserReq'
import { catchAsync } from '~utils/catchAsync'
import { CustomError } from '~utils/customError'

type UpdateUserDto = Partial<Pick<IUser, 'name' | 'email' | 'photo'>>

export const getAllUsers = catchAsync(async (req, res, next) => {
	const users = await UserModel.find().select('-password')
	res.json({
		status: 'Success',
		results: users.length,
		data: {
			users,
		},
	})
})

export const updateUserProfile = catchAsync(
	async (req: WithUserReq, res, _next) => {
		const { name, email, photo } = req.body as UpdateUserDto
		const authenticatedUser = req.user as IUser
		try {
			const dbUser = await UserModel.findById(authenticatedUser._id)
			if (!dbUser) {
				throw new CustomError(
					`User doesn't exist or has been deleted`,
					HttpStatus.NOT_FOUND
				)
			}
			name && (dbUser.name = name)
			email && (dbUser.email = email)
			photo && (dbUser.photo = photo)
			await dbUser.save({ validateModifiedOnly: true })
			res.json({
				status: 'Success',
				message: 'Successfully updated user profile',
			})
		} catch (error: any) {
			throw new CustomError(error, HttpStatus.UNAUTHORIZED)
		}
	}
)
export const deleteUser = catchAsync(async (req: WithUserReq, res, _next) => {
	const authenticatedUser = req.user as IUser
	try {
		await UserModel.findByIdAndUpdate(authenticatedUser._id, {
			isActive: false,
		})
		res.json({
			status: 'Success',
			message: 'Your account has been deleted',
		})
	} catch (error: any) {
		throw new CustomError(error, HttpStatus.UNAUTHORIZED)
	}
})
