import { NextFunction, Response } from 'express'

import {
	createDocument,
	deleteDocument,
	getOneDocument,
	updateDocument,
} from '~controllers/factory.handler'
import { ReviewModel } from '~models/review.model'
import { WithUserReq } from '~typings/withUserReq'
import { catchAsync } from '~utils/catchAsync'
import { sendResponse } from '~utils/sendResponse'

export const getAllReviews = catchAsync(async (req, res, _next) => {
	const filter = req.params.tourId
		? { tour: req.params.tourId }
		: ({} as Record<string, string>)

	const reviews = await ReviewModel.find(filter)
	sendResponse({
		res,
		status: 'Success',
		results: reviews.length,
		data: {
			reviews,
		},
	})
})

// middleware for createDocument controller
export const setTourUserIds = (
	req: WithUserReq,
	res: Response,
	next: NextFunction
): void => {
	if (req.user) {
		!req.body.tour && (req.body.tour = req.params.tourId)
		!req.body.user && (req.body.user = req.user._id)
	}
	next()
}

export const getOneReview = getOneDocument(ReviewModel)
export const createReview = createDocument(ReviewModel)
export const deleteReview = deleteDocument(ReviewModel)
export const updateReview = updateDocument(ReviewModel)
