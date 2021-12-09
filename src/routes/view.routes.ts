import { Router } from 'express'

import { getOverView, getTour, loginForm } from '~controllers/view.controller'
import { authenticated } from '~middlewares/authenticated'
import { isLoggedIn } from '~middlewares/isLoggedIn'

const viewsRouter = Router()

viewsRouter.use(isLoggedIn)

viewsRouter.get('/', getOverView)
viewsRouter.get('/tour/:slug', authenticated, getTour)
viewsRouter.get('/login', loginForm)

export default viewsRouter
