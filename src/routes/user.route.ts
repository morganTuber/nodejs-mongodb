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
	updateUserProfile,
} from '~controllers/user.controller'
import { authenticated } from '~middlewares/authenticated'
import { restrictTo } from '~middlewares/restrictTo'
import { Role } from '~typings/role.enum'

const userRouter = Router()

//user routes
// userRouter.get('/', getAllUsers)
userRouter.get('/', authenticated, restrictTo(Role.admin, Role.guide), getAllUsers)
userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.delete(
	'/delete-account',
	authenticated,
	restrictTo(Role.admin),
	deleteUser
)
userRouter.post('/forgotPassword', forgotPassword)
userRouter.post('/changePassword', authenticated, changePassword)
userRouter.post('/resetPassword/:resetToken', resetPassword)
userRouter.patch('/update-profile', authenticated, updateUserProfile)
// userRouter.get('/:id', getUserById)
// userRouter.patch('/:id', updateUser)
// userRouter.delete('/:id', deleteUser)

export default userRouter
