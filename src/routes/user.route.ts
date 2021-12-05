import { Router } from 'express'

import {
	changePassword,
	forgotPassword,
	login,
	resetPassword,
	signup,
} from '~controllers/auth.controller'
import {
	deleteUser,
	getAllUsers,
	getMe,
	getOneUser,
	updateUserProfile,
} from '~controllers/user.controller'
import { authenticated } from '~middlewares/authenticated'
import { restrictTo } from '~middlewares/restrictTo'
import { Role } from '~typings/role.enum'

const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.post('/forgotPassword', forgotPassword)
userRouter.post('/resetPassword/:resetToken', resetPassword)

// restrict access to the following routes to authenticated users only
userRouter.use(authenticated)

userRouter.get('/me', getMe, getOneUser)
userRouter.post('/changePassword', changePassword)
userRouter.patch('/update-profile', updateUserProfile)

//restrict access to following routes to users with the role of admin and lead-guide only
userRouter.use(restrictTo(Role.admin, Role['lead-guide']))
userRouter.get('/', getAllUsers)
userRouter.delete('/delete-account', deleteUser)

export default userRouter
