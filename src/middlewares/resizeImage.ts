import sharp from 'sharp'

import { WithUserReq } from '~typings/withUserReq'
import { catchAsync } from '~utils/catchAsync'

const resizeImage = async (
	buffer: Express.Multer.File['buffer'],
	path: string,
	width?: number,
	height?: number
) => {
	await sharp(buffer)
		.resize(width ?? 500, height ?? 500)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`public/img/${path}`)
}

export const resizeUserPhoto = catchAsync(async (req: WithUserReq, _res, next) => {
	if (!req.file || !req.user) return next()
	//save filename to the req object so other middlewares can access it
	req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`
	resizeImage(req.file.buffer, `users/${req.file.filename}`)
	next()
})
export const resizeTourImages = catchAsync(async (req, _res, next) => {
	if (!req.files) return next()

	// to generate unique name for uploaded image
	const tourId = req.params.id
	const files = req.files as Record<string, Express.Multer.File[]>

	const coverImageBuffer = files.imageCover[0].buffer
	const tourImagesBuffer = files.images.map(file => file.buffer)

	//name for the coverimage when it is saved to disk
	const coverImageName = `tour-${tourId}-cover.jpeg`
	await resizeImage(coverImageBuffer, `tours/${coverImageName}`, 2000, 1333)

	//waits for all the images to be resized before moving to the next middleware stack
	const images: string[] = []
	await Promise.all(
		tourImagesBuffer.map(async (buffer, index) => {
			const imageName = `tour-${tourId}-${index + 1}.jpeg`
			await resizeImage(buffer, `tours/${imageName}`, 2000, 1333)
			images.push(imageName)
		})
	)
	//save imageCover and images on req.body so the update factory handler can easily update tour with new images
	req.body.imageCover = coverImageName
	req.body.images = images
	next()
})
