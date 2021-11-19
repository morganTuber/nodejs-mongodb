import { Request } from 'express'

import { IUser } from '~typings/user.interface'

export interface WithUserReq extends Request {
	user?: IUser
}
