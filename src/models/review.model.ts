import {
	getModelForClass,
	modelOptions,
	mongoose,
	pre,
	prop,
} from '@typegoose/typegoose'

@modelOptions({
	schemaOptions: {
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
})
@pre<Review>(/^find/, function (next) {
	this.populate({
		path: 'tour',
		select: 'name',
	})
	this.populate({ path: 'user', select: 'name photo' })
	next()
})
export class Review {
	@prop({ required: true })
	public review: string

	@prop({ min: 1, max: 5 })
	public rating: number

	@prop({ default: new Date() })
	public createdAt: Date

	@prop({ ref: 'Tour', required: true })
	public tour: mongoose.Schema.Types.ObjectId

	@prop({ ref: 'User', required: true })
	public user: mongoose.Schema.Types.ObjectId
}
export const ReviewModel = getModelForClass(Review)
