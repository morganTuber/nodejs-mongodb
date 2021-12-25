/* eslint-disable no-unused-vars */
import type { NextFunction, Request, Response } from 'express'

import type { IError } from '~typings/error.interface'

type ErrorHandler = (error: IError, req: Request, res: Response, next: NextFunction) => void

const sendError = (req: Request, res: Response, error: IError) => {
	if (req.originalUrl.startsWith('/api')) {
		return res.status(error.statusCode).json({
			message: error.message,
		})
	}
	return res.status(error.statusCode).render('error', {
		title: 'Something went wrong',
		message: error.message,
	})
}

export const globalErrors: ErrorHandler = (error, req, res, next) => {
	error.statusCode = error.statusCode ?? 500
	error.status = error.status ?? 'Error'
	sendError(req, res, error)
}
