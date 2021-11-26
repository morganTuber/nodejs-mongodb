import { Router } from 'express'

import {
	createReview,
	deleteReview,
	getAllReviews,
	setTourUserIds,
	updateReview,
} from '~controllers/review.controller'
import { authenticated } from '~middlewares/authenticated'
import { restrictTo } from '~middlewares/restrictTo'
import { Role } from '~typings/role.enum'

const reviewRouter = Router({ mergeParams: true })

reviewRouter.get('/', getAllReviews)
reviewRouter.post(
	'/',
	authenticated,
	restrictTo(Role.user),
	setTourUserIds,
	createReview
)
reviewRouter.post('/:id', authenticated, restrictTo(Role.user), updateReview)
reviewRouter.delete(
	'/:id',
	authenticated,
	restrictTo(Role.admin, Role.user),
	deleteReview
)

export default reviewRouter
