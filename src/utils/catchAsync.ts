import { NextFunction, Request, Response } from 'express'

type AsyncFunc<T> = (
    req: T,
    res: Response,
    next: NextFunction
) => Promise<void>

//catch all async errors and pass them to the global error handling middleware
export const catchAsync = <T = Request>(fn: AsyncFunc<T>) => {
    return (req: T, res: Response, next: NextFunction): void => {
        fn(req, res, next).catch(error => next(error))
    }
}
