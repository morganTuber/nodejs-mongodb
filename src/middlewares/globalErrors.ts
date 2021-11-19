/* eslint-disable no-unused-vars */
import type { NextFunction, Request, Response } from 'express'

import type { IError } from '~typings/error.interface'

type ErrorHandler = (
    error: IError,
    req: Request,
    res: Response,
    next: NextFunction
) => void

export const globalErrors: ErrorHandler = (error, _req, res, next) => {
    error.statusCode = error.statusCode ?? 500
    error.status = error.status ?? 'Error'

    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
    })
    next()
}
