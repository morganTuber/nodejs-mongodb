import { ReturnModelType } from '@typegoose/typegoose'
import { AnyParamConstructor, BeAnObject } from '@typegoose/typegoose/lib/types'

import { catchAsync } from '~utils/catchAsync'
import { CustomError } from '~utils/customError'
import { sendResponse } from '~utils/sendResponse'

type Model<T> = ReturnModelType<AnyParamConstructor<T>, BeAnObject>
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const deleteDocument = <T>(model: Model<T>) =>
	catchAsync(async (req, res, next) => {
		const doc = await model.findByIdAndDelete(req.params.id)
		if (!doc) {
			throw next(
				new CustomError(`No document found with that ID ${req.params.id}`, 404)
			)
		}
		sendResponse({
			res,
			status: 'Success',
			message: `Deleted document with id ${req.params.id}`,
		})
	})
