import {
	getModelForClass,
	modelOptions,
	mongoose,
	pre,
	prop,
	Ref,
	Severity,
} from '@typegoose/typegoose'

import { Review } from '~models/review.model'
import { ITour } from '~typings/tour.interface'

@modelOptions({
	options: { allowMixed: Severity.ALLOW },
	schemaOptions: {
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
})
@pre<Tour>(/^find/, function (next) {
	this.populate({
		path: 'guides',
		select: '-__v -email',
	})
	next()
})
export class Tour implements Omit<ITour, 'id'> {
	@prop({ required: [true, 'A tour must have a name'], unique: true })
	public name: string

	@prop({ required: [true, 'A tour must have a duration'] })
	public duration: number

	@prop({ required: [true, 'A tour must have a max group size'] })
	public maxGroupSize: number

	@prop({
		required: [true, 'Tour must have a difficulty'],
		enum: ['easy', 'difficult', 'medium'],
	})
	public difficulty: string

	@prop({
		default: 4.5,
		min: 1,
		max: 5,
	})
	public ratingsAverage: number

	@prop({ default: 0 })
	public ratingsQuantity: number

	@prop({ required: [true, 'A tour must include price'] })
	public price: number

	@prop({ default: 0 })
	public priceDiscount: number

	@prop({ trim: true, required: [true, 'A tour must have a summary'] })
	public summary: string

	@prop({ required: [true, 'A tour must have a description'] })
	public description: string

	@prop({ required: [true, 'A tour must have a cover photo'] })
	public imageCover: string

	@prop({ type: () => [String] })
	public images: string[]

	@prop({ default: Date.now() })
	public createdAt: Date

	@prop({ type: [String] })
	public startDates: string[]

	@prop({ type: () => StartLocation })
	public startLocation: StartLocation

	@prop({ type: () => [Location] })
	public locations: Location[]

	@prop({ ref: 'User' })
	public guides: mongoose.Schema.Types.ObjectId[]

	@prop({
		ref: 'Review',
		foreignField: 'tour',
		localField: '_id',
		justOne: true,
	})
	public reviews: Ref<Review>
}
class Location {
	@prop({ default: 'Point', enum: ['Point'] })
	public type: string

	@prop({ type: Number })
	public coordinates: mongoose.Types.Array<number>

	@prop()
	public address: string

	@prop()
	public description: string

	@prop()
	public day: number
}
class StartLocation {
	@prop({ default: 'Point', enum: ['Point'] })
	public type: string

	@prop()
	public coordinates: mongoose.Types.Array<number>

	@prop()
	public description: string
}
export const TourModel = getModelForClass(Tour)
