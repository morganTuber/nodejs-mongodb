import {
	getModelForClass,
	index,
	modelOptions,
	pre,
	prop,
	Ref,
	Severity,
} from '@typegoose/typegoose'

import { Review } from '~models/review.model'
import { User } from '~models/user.model'
import { ITour } from '~typings/tour.interface'

@modelOptions({
	options: { allowMixed: Severity.ALLOW },
})
class Location {
	@prop({ default: 'Point', enum: ['Point'] })
	public type: string

	@prop({ type: Number })
	public coordinates: number[]

	@prop()
	public description: string

	@prop()
	public address: string

	@prop()
	public day: number
}
@modelOptions({
	options: { allowMixed: Severity.ALLOW },
})
class StartLocation {
	@prop({ default: 'Point', enum: ['Point'] })
	public type: string

	@prop({ type: Number })
	public coordinates: number[]

	@prop()
	public address: string

	@prop()
	public description: string
}

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
@index<Tour>({ price: 1, ratingsAverage: -1 })
@index<Tour>({ slug: 1 })
@index<Tour>({ startLocation: '2dsphere' })
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
		set: (val: number) => Math.round(val * 10) / 10,
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

	@prop({ type: String })
	public images: string[]

	@prop({ default: Date.now() })
	public createdAt: Date

	@prop({ items: String })
	public startDates: string[]

	@prop({ type: StartLocation })
	public startLocation: StartLocation

	@prop({ type: [Location] })
	public locations: Location[]

	@prop({ ref: 'User' })
	public guides: Ref<User>[]

	@prop({ ref: 'Review', foreignField: 'tour', localField: '_id' })
	public reviews: Ref<Review>[]

	public get slug(): string {
		return this.name.replace(/\s+/g, '-').toLowerCase()
	}
}

export const TourModel = getModelForClass(Tour)
