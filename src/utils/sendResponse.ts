import { Response } from 'express'

import { HttpStatus } from '~typings/http-status.enum'

interface ResponseValue {
	res: Response
	status?: 'Success' | 'Fail'
	statusCode?: HttpStatus
	message?: string
	results?: number
	data?: {
		[key: string]: unknown
	}
}

/** A fully typed function to send response to the client */
export const sendResponse = (values: ResponseValue): void => {
	const { res, ...rest } = values
	if (rest.statusCode) {
		res.status(res.statusCode).json({ ...rest })
	} else {
		res.json({ ...rest })
	}
}
