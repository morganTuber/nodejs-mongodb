import { ReturnModelType } from '@typegoose/typegoose'
import { AnyParamConstructor, BeAnObject } from '@typegoose/typegoose/lib/types'
import { omit } from 'lodash'

import { ApiFeatures } from '~utils/apiFeatures'
import { catchAsync } from '~utils/catchAsync'
import { CustomError } from '~utils/customError'
import { sendResponse } from '~utils/sendResponse'

type Model = ReturnModelType<AnyParamConstructor<unknown>, BeAnObject>

/** Delete document*/
export const deleteDocument = (model: Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await model.findByIdAndDelete(req.params.id)
		if (!doc) {
			return next(
				new CustomError(`No document found with that ID ${req.params.id}`, 404)
			)
		}
		sendResponse({
			res,
			status: 'Success',
			message: `Deleted document with id ${req.params.id}`,
		})
	})
export const updateDocument = (model: Model) =>
	catchAsync(async (req, res, next) => {
		const updatedDoc = await model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		})
		if (!updateDocument) {
			return next(
				new CustomError(`No document found with that ID ${req.params.id}`, 404)
			)
		}
		sendResponse({
			res,
			status: 'Success',
			message: `Updated document with id ${req.params.id}`,
			data: updatedDoc,
		})
	})

export const createDocument = (model: Model) =>
	catchAsync(async (req, res, _next) => {
		const doc = await model.create(req.body)
		sendResponse({
			res,
			status: 'Success',
			message: `Created new document`,
			data: doc,
		})
	})
export const getOneDocument = (model: Model, populateOptions?: Record<string, string>) =>
	catchAsync(async (req, res, next) => {
		let query = model.findById(req.params.id)
		populateOptions && (query = query.populate(populateOptions))
		const doc = await query
		if (!doc) {
			return next(
				new CustomError(`No document found with that ID ${req.params.id}`, 404)
			)
		}
		sendResponse({
			res,
			status: 'Success',
			data: doc,
		})
	})

export const getAllDocuments = (model: Model) =>
	catchAsync(async (req, res, _next) => {
		let query = omit({ ...req.query }, ['page', 'sort', 'limit', 'fields']) as Record<
			string,
			string
		>
		//replace standard query object key with mongodb query key
		query = JSON.parse(
			JSON.stringify(query).replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`)
		) as Record<string, string>

		const docQuery = model.find(query)
		//implement features like sorting,limiting and pagination
		const apiFeatures = new ApiFeatures(docQuery, req)
		void apiFeatures.sort().fields().paginate()
		const docs = await apiFeatures.query
		sendResponse({
			res,
			status: 'Success',
			results: docs.length,
			data: docs,
		})
	})
