/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'

import { TourModel } from '~models/tour.model'
import { HttpStatus } from '~typings/http-status.enum'
import { ApiFeatures } from '~utils/apiFeatures'
import { catchAsync } from '~utils/catchAsync'
import { CustomError } from '~utils/customError'
import { sendResponse } from '~utils/sendResponse'

type TourController = (req: Request, res: Response, next: NextFunction) => void

//get all tours
export const getAllTours: TourController = catchAsync(async (req, res, _next) => {
	let query = omit({ ...req.query }, ['page', 'sort', 'limit', 'fields']) as Record<
		string,
		string
	>
	//replace standard query object key with mongodb query key
	query = JSON.parse(
		JSON.stringify(query).replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`)
	) as Record<string, string>
	//*query for the tour model

	const toursQuery = TourModel.find(query)
	//implement features like sorting,limiting and pagination
	const apiFeatures = new ApiFeatures(toursQuery, req)
	void apiFeatures.sort().fields().paginate()
	const tours = await apiFeatures.query
	sendResponse({
		res,
		status: 'Success',
		statusCode: HttpStatus.OK,
		results: tours.length,
		data: { tours },
	})
})
//return a single tour by id
export const getTourById: TourController = catchAsync(async (req, res, next) => {
	const tour = await TourModel.findById(req.params.id)

	if (tour) {
		sendResponse({
			res,
			status: 'Success',
			statusCode: HttpStatus.FOUND,
			data: { tour },
		})
	} else {
		next(new CustomError(`Tour with id ${req.params.id} not found`, 404))
	}
})
//creates a new tour
export const createTour: TourController = catchAsync(async (req, res, next) => {
	const newTour = await TourModel.create(req.body)
	sendResponse({
		res,
		status: 'Success',
		data: { tour: newTour },
	})
})
//update tour
export const updateTour: TourController = catchAsync(async (req, res, next) => {
	const updatedTour = await TourModel.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	})
	if (!updatedTour) {
		return next(new CustomError(`Tour with id ${req.params.id} not found`, 404))
	}
	sendResponse({
		res,
		status: 'Success',
		statusCode: HttpStatus.OK,
		data: { tour: updateTour },
	})
})
//delete tour
export const deleteTour: TourController = catchAsync(async (req, res, next) => {
	const tour = await TourModel.findByIdAndDelete(req.params.id)
	if (!tour) {
		return next(new CustomError(`Tour with id ${req.params.id} not found`, 404))
	}
	sendResponse({
		res,
		statusCode: HttpStatus.GONE,
		message: `Successfully deleted tour with id ${req.params.id}`,
	})
})
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
