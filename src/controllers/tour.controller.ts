/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'

import {
	createDocument,
	deleteDocument,
	getAllDocuments,
	getOneDocument,
	updateDocument,
} from '~controllers/factory.handler'
import { TourModel } from '~models/tour.model'
import { catchAsync } from '~utils/catchAsync'
import { sendResponse } from '~utils/sendResponse'

type TourController = (req: Request, res: Response, next: NextFunction) => void

export const getAllTours = getAllDocuments(TourModel)
export const getTourById = getOneDocument(TourModel, { path: 'reviews' })
export const createTour = createDocument(TourModel)
export const updateTour = updateDocument(TourModel)
export const deleteTour = deleteDocument(TourModel)

export const getTourStats: TourController = catchAsync(async (_req, res, next) => {
	const stats = await TourModel.aggregate([
		{
			$group: {
				_id: { $toUpper: '$difficulty' },
				totalTours: { $sum: 1 },
				avgRatings: { $avg: '$ratingsAverage' },
				totalRatings: { $sum: '$ratingsQuantity' },
				avgPrice: { $avg: '$price' },
				minPrice: { $min: '$price' },
				maxPrice: { $max: '$price' },
			},
		},
	])
	sendResponse({
		res,
		status: 'Success',
		results: stats.length,
		data: { stats },
	})
})
export const getMonthlyPlan: TourController = catchAsync(async (req, res) => {
	const { year } = req.params
	const plan = await TourModel.aggregate([
		{
			$unwind: '$startDates',
		},
		{
			$addFields: {
				date: { $toDate: '$startDates' },
			},
		},
		{
			$match: {
				date: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},

		{
			$group: {
				_id: { $month: '$date' },
				numOfTours: { $sum: 1 },
				tours: { $push: '$name' },
			},
		},
		{
			$sort: {
				_id: 1,
			},
		},
		{
			$addFields: {
				month: '$_id',
			},
		},
		{
			$unset: '_id',
		},
	])
	sendResponse({
		res,
		status: 'Success',
		results: plan.length,
		data: { plan },
	})
})
