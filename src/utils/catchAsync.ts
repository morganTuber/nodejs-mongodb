import { NextFunction, Request, Response } from 'express'

import { AsyncFunc } from '~typings/async-func.type'

//catch all async errors and pass them to the global error handling middleware
export const catchAsync = <T = Request>(fn: AsyncFunc<T>) => {
	return (req: T, res: Response, next: NextFunction): void => {
		fn(req, res, next).catch(error => next(error))
	}
}
