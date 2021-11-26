import { NextFunction, Request, Response } from 'express'

export type AsyncFunc<T = Request> = (
	req: T,
	res: Response,
	next: NextFunction
) => Promise<void>
