import { NextFunction, Request, Response } from 'express'

export const cheapTours = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    req.query.limit = '5'
    req.query.sort = 'price,averageRatings'
    next()
}
