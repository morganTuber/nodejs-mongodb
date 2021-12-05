import {
	createDocument,
	deleteDocument,
	getAllDocuments,
	getOneDocument,
	updateDocument,
} from '~controllers/factory.handler'
import { TourModel } from '~models/tour.model'
import { HttpStatus } from '~typings/http-status.enum'
import { catchAsync } from '~utils/catchAsync'
import { CustomError } from '~utils/customError'
import { sendResponse } from '~utils/sendResponse'

export interface NearbyToursQueryDto {
	distance?: string
	latlong?: string
	unit?: string
}

export const getAllTours = getAllDocuments(TourModel)
export const getTourById = getOneDocument(TourModel, { path: 'reviews' })
export const createTour = createDocument(TourModel)
export const updateTour = updateDocument(TourModel)
export const deleteTour = deleteDocument(TourModel)

export const getNearbyTours = catchAsync(async (req, res, next) => {
	const { distance, latlong, unit = 'mi' } = req.query as unknown as NearbyToursQueryDto
	if (!latlong || !distance) {
		return next(
			new CustomError(
				'Latitude,longitude and distance are required in the format distance=10&latlong=10,20',
				HttpStatus.BAD_REQUEST
			)
		)
	}
	const [lat, long] = latlong.split(',')
	const radius = unit === 'mi' ? +distance / 3963.2 : +distance / 6378.1
	const nearbyTours = await TourModel.find({
		startLocation: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
	})
	sendResponse({
		res,
		status: 'Success',
		results: nearbyTours.length,
		data: {
			tours: nearbyTours,
		},
	})
})
export const getNearbyTourDistances = catchAsync(async (req, res, next) => {
	const { latlong, unit } = req.query as unknown as Omit<NearbyToursQueryDto, 'distance'>
	if (!latlong) {
		return next(
			new CustomError('Latitude and longitude are required', HttpStatus.BAD_REQUEST)
		)
	}
	const [lat, long] = latlong.split(',')
	const multiplier = unit === 'mi' ? 0.000621371 : 0.001
	const nearbyTourDistances = await TourModel.aggregate<{ distance: number; name: string }>([
		{
			$geoNear: {
				near: {
					type: 'Point',
					coordinates: [+long, +lat],
				},
				distanceField: 'distance',
				distanceMultiplier: multiplier,
			},
		},
		{
			$project: {
				distance: 1,
				name: 1,
			},
		},
	])
	sendResponse({
		res,
		status: 'Success',
		results: nearbyTourDistances.length,
		data: {
			distances: nearbyTourDistances,
		},
	})
})
export const getTourStats = catchAsync(async (_req, res, next) => {
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
export const getMonthlyPlan = catchAsync(async (req, res) => {
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
