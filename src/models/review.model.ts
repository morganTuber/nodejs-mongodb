import {
	getModelForClass,
	index,
	modelOptions,
	post,
	pre,
	prop,
	Ref,
} from '@typegoose/typegoose'

import { Tour, TourModel } from '~models/tour.model'
import { User } from '~models/user.model'

type ReviewStat = { id: string; averageRating: number; numRatings: number }

@modelOptions({
	schemaOptions: {
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
})
@index({ tour: 1, user: 1 }, { unique: true })
@pre<Review>(/^find/, function (next) {
	this.populate({
		path: 'tour',
		select: 'name -guides',
	})
	this.populate({ path: 'user', select: 'name photo' })
	next()
})
@post<Review>('save', async function (review) {
	const stats = await review.calculateRatingData(review.tour)
	await TourModel.findByIdAndUpdate(review.tour, {
		ratingsAverage: stats[0].averageRating,
		ratingsQuantity: stats[0].numRatings,
	})
})
export class Review {
	@prop({ required: true })
	public review: string

	@prop({ min: 1, max: 5 })
	public rating: number

	@prop({ default: new Date() })
	public createdAt: Date

	@prop({ ref: 'Tour', required: true })
	public tour: Ref<Tour>

	@prop({ ref: 'User', required: true })
	public user: Ref<User>

	public async calculateRatingData<T>(tour: T) {
		const stats: ReviewStat[] = await ReviewModel.aggregate([
			{
				$match: { tour: tour },
			},
			{
				$group: {
					_id: '$tour',
					numRatings: { $sum: 1 },
					averageRating: { $avg: '$rating' },
				},
			},
		])
		return stats
	}
}
export const ReviewModel = getModelForClass(Review)
