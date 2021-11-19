import { Router } from 'express'
import reviewRouter from 'src/routes/review.routes'

import {
	createTour,
	deleteTour,
	getAllTours,
	getMonthlyPlan,
	getTourById,
	getTourStats,
	updateTour,
} from '~controllers/tour.controller'
import { authenticated } from '~middlewares/authenticated'
import { cheapTours } from '~middlewares/cheapTours'
import { restrictTo } from '~middlewares/restrictTo'
import { Role } from '~typings/role.enum'

const tourRouter = Router()

tourRouter.use('/:tourId/reviews', reviewRouter)
//tour routes
tourRouter.get(
	'/monthly-plan/:year',
	authenticated,
	restrictTo(Role.admin, Role['lead-guide']),
	getMonthlyPlan
)
tourRouter.get('/stats', getTourStats)
tourRouter.get('/top-cheap-tours', cheapTours, getAllTours)
tourRouter.get('/', getAllTours)
tourRouter.get('/:id', getTourById)
tourRouter.post('/:id')
tourRouter.post('/', createTour)
tourRouter.patch('/:id', updateTour)
tourRouter.delete('/:id', deleteTour)

export default tourRouter
