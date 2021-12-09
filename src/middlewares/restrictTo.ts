import { NextFunction, Response } from 'express'

import { HttpStatus } from '~typings/http-status.enum'
import { Role } from '~typings/role.enum'
import { WithUserReq } from '~typings/withUserReq'
import { CustomError } from '~utils/customError'

/**
 * @description Middleware to restrict access to a route to a specific role
 */
export const restrictTo = (...roles: Role[]) => {
	return (req: WithUserReq, res: Response, next: NextFunction): void => {
		if (req.user && !roles.includes(req.user.role)) {
			throw new CustomError(`Restricted Route`, HttpStatus.UNAUTHORIZED)
		}
		next()
	}
}
