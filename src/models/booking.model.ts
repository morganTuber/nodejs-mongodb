import { getModelForClass, pre, prop, Ref } from '@typegoose/typegoose'

import { Tour } from '~models/tour.model'
import { User } from '~models/user.model'

@pre(/^find/, function (next) {
	this.populate({
		path: 'tour',
		select: '-guides',
	})
	this.populate({
		path: 'user',
		select: 'email name',
	})
	next()
})
export class Booking {
	@prop({ ref: 'Tour', required: true })
	public tour: Ref<Tour>

	@prop({ ref: 'User', required: true })
	public user: Ref<User>

	@prop({ required: true })
	public price: number

	@prop({ default: Date.now() })
	public createdAt: Date
}

export const bookingModel = getModelForClass(Booking)
