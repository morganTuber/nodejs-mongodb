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

reviewRouter.use(authenticated)

reviewRouter.get('/', getAllReviews)
reviewRouter.post('/', restrictTo(Role.user), setTourUserIds, createReview)
reviewRouter.post('/:id', restrictTo(Role.user), updateReview)
reviewRouter.delete('/:id', restrictTo(Role.admin, Role.user), deleteReview)

export default reviewRouter
