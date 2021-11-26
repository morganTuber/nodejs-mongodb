import { Router } from 'express'

import {
	createReview,
	deleteReview,
	getAllReviews,
} from '~controllers/review.controller'
import { authenticated } from '~middlewares/authenticated'
import { restrictTo } from '~middlewares/restrictTo'
import { Role } from '~typings/role.enum'

const reviewRouter = Router({ mergeParams: true })

reviewRouter.get('/', getAllReviews)
reviewRouter.post('/', authenticated, restrictTo(Role.user), createReview)
reviewRouter.delete('/:id', authenticated, restrictTo(Role.admin), deleteReview)

export default reviewRouter
