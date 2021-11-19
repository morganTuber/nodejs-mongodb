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
export const createReview = catchAsync(async (req: WithUserReq, res, _next) => {
	if (req.user) {
		!req.body.tour && (req.body.tour = req.params.tourId)
		!req.body.user && (req.body.user = req.user._id)
	}
	const review = await ReviewModel.create(req.body)
	sendResponse({
		res,
		status: 'Success',
		message: 'Successfully created a new review',
		data: {
			review,
		},
	})
})
