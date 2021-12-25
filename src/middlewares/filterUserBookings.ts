import { NextFunction, Response } from 'express'

import { WithUserReq } from '~typings/withUserReq'

/**
 * @description Filters only currently logged in user bookings
 */
export const filterUserBookings = (req: WithUserReq, res: Response, next: NextFunction) => {
	req.query.user = req.user?._id
	next()
}
