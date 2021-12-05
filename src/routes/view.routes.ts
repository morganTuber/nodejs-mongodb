import { Router } from 'express'

import { getOverView, getTour } from '~controllers/view.controller'

const viewsRouter = Router()

viewsRouter.get('/overview', getOverView)
viewsRouter.get('/tour', getTour)

export default viewsRouter
