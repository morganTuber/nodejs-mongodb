import { Router } from 'express'

import {
	changePassword,
	forgotPassword,
	login,
	logout,
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
import { resizeUserPhoto } from '~middlewares/resizeImage'
import { restrictTo } from '~middlewares/restrictTo'
import { uploadSinglePhoto } from '~middlewares/uploadPhoto'
import { Role } from '~typings/role.enum'

const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.post('/forgotPassword', forgotPassword)
userRouter.post('/resetPassword/:resetToken', resetPassword)

// restrict access to the following routes to authenticated users only
userRouter.use(authenticated)

userRouter.get('/logout', logout)
userRouter.get('/me', getMe, getOneUser)
userRouter.post('/change-password', changePassword)
userRouter.patch(
	'/update-profile',
	uploadSinglePhoto('photo'),
	resizeUserPhoto,
	updateUserProfile
)

//restrict access to following routes to users with the role of admin
userRouter.use(restrictTo(Role.admin))
userRouter.get('/', getAllUsers)
userRouter.delete('/delete-account', deleteUser)

export default userRouter
