import { NextFunction, Request, Response } from 'express'

type ViewController = (req: Request, res: Response, next: NextFunction) => void

export const getOverView: ViewController = (req, res, next) => {
	res.render('overview', {
		title: 'All Tours',
	})
}
export const getTour: ViewController = (req, res, next) => {
	res.render('tour', {
		title: 'Demo Tour Name',
	})
}
