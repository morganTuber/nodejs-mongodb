import { Router } from 'express'
import reviewRouter from 'src/routes/review.routes'

import {
	createTour,
	deleteTour,
	getAllTours,
	getMonthlyPlan,
	getNearbyTourDistances,
	getNearbyTours,
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

//get nearby tours using mongodb geo-spatial queries
tourRouter.get('/nearby-tours', getNearbyTours)
//get nearby tours distances
tourRouter.get('/nearby-tour-distances', getNearbyTourDistances)
tourRouter.get('/stats', getTourStats)
tourRouter.get('/top-cheap-tours', cheapTours, getAllTours)
tourRouter.get('/', getAllTours)
tourRouter.get('/:id', getTourById)
tourRouter.post('/:id')

//restrict access to the following routes to only admin,lead-guide and guide
tourRouter.use(authenticated, restrictTo(Role.admin, Role['lead-guide'], Role.guide))

tourRouter.get('/monthly-plan/:year', getMonthlyPlan)
tourRouter.post('/', createTour)
tourRouter.patch('/:id', updateTour)
tourRouter.delete('/:id', deleteTour)

export default tourRouter
