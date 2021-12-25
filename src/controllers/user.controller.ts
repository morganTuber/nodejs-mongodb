/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from 'express'
import { pick } from 'lodash'

import { deleteDocument, getAllDocuments, getOneDocument } from '~controllers/factory.handler'
import { UserModel } from '~models/user.model'
import { HttpStatus } from '~typings/http-status.enum'
import { IUser } from '~typings/user.interface'
import { WithUserReq } from '~typings/withUserReq'
import { catchAsync } from '~utils/catchAsync'
import { CustomError } from '~utils/customError'
import { sendResponse } from '~utils/sendResponse'

export const updateUserProfile = catchAsync(async (req: WithUserReq, res, next) => {
	const filteredBody = pick(req.body, 'name', 'email') as Record<string, string>
	//update user profile if there is a file in req.file
	req.file && (filteredBody.photo = req.file.filename)
	const authenticatedUser = req.user as Required<IUser>

	const updatedUser = await UserModel.findByIdAndUpdate(
		authenticatedUser._id,
		filteredBody,
		{ new: true, runValidators: true }
	)
	if (!updatedUser) {
		return next(
			new CustomError(`User doesn't exist or has been deleted`, HttpStatus.NOT_FOUND)
		)
	}
	sendResponse({
		res,
		status: 'Success',
		message: 'Successfully updated user profile',
		data: updatedUser,
	})
})

//middleware to put user id in req.params
export const getMe = (req: WithUserReq, res: Response, next: NextFunction): void => {
	req.user && (req.params.id = req.user._id)
	next()
}
export const getOneUser = getOneDocument(UserModel)
export const getAllUsers = getAllDocuments(UserModel)
export const deleteUser = deleteDocument(UserModel)
