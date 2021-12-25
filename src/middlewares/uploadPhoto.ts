import multer, { Field, FileFilterCallback } from 'multer'

import { WithUserReq } from '~typings/withUserReq'
import { CustomError } from '~utils/customError'

type MulterFilter = (
	req: WithUserReq,
	file: Express.Multer.File,
	cb: FileFilterCallback
) => void

export const multerStorage = multer.memoryStorage()
export const multerFilter: MulterFilter = (_req, file, callback) => {
	if (file.mimetype.startsWith('image')) {
		return callback(null, true)
	}
	callback(new CustomError('Not an image! Please upload only images.', 400))
}

const uploadPhoto = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
})
export const uploadSinglePhoto = (fieldName: string) => uploadPhoto.single(fieldName)
export const uploadMultiplePhotos = (fields: Field[]) => uploadPhoto.fields(fields)
