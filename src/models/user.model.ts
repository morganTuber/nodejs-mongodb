import { DocumentType, getModelForClass, modelOptions, pre, prop } from '@typegoose/typegoose'
import { compare, hash } from 'bcryptjs'
import { createHash, randomBytes } from 'crypto'

import { Role } from '~typings/role.enum'

@modelOptions({
	schemaOptions: {
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
})
@pre<User>('save', async function (next) {
	//hash the password everytime password is changed
	if (this.isModified('password')) {
		this.password = await hash(this.password, 12)
		this.passwordConfirm = undefined
		//do not set passwordChangedAt field when the user is created for the first time
		!this.isNew && (this.passwordChangedAt = new Date())
	}
	next()
})
@pre<typeof UserModel>(/^find/, function (next) {
	this.find({ isActive: true })
	next()
})
export class User {
	@prop({ unique: true, required: [true, 'Name is required'] })
	public name: string

	@prop({
		unique: true,
		required: [true, 'Email address is required'],
		lowercase: true,
		validate: {
			validator(v: string) {
				return /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v)
			},
			message: '{VALUE} is not a valid email address',
		},
	})
	public email: string

	@prop({ default: 'default.jpg' })
	public photo?: string

	@prop({
		minlength: 8,
		required: [true, 'Password required'],
		select: false,
		validate: {
			validator(password: string) {
				return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
					password
				)
			},
			message: 'Password too weak',
		},
	})
	public password: string

	@prop({
		required: [true, 'Confirmation password required'],
		validate: {
			validator: function (password: string) {
				const originalPassword = (this as unknown as DocumentType<User>).password
				return password === originalPassword.slice()
			},
			message: 'Password didnt match',
		},
	})
	public passwordConfirm?: string

	@prop({ select: false })
	public passwordChangedAt?: Date

	@prop({ enum: Role, default: Role.user })
	public role: Role

	@prop()
	public passwordResetToken?: string

	@prop()
	public passwordResetTokenExpiresIn?: number

	@prop({ default: true, select: false })
	public isActive: boolean

	//methods
	public isPasswordChanged(jwtExpirationDate: number): boolean {
		if (this.passwordChangedAt) {
			return jwtExpirationDate < Number(this.passwordChangedAt.getTime() / 1000)
		}
		return false
	}
	public createPasswordResetToken(): string {
		const resetToken = randomBytes(32).toString('hex')
		this.passwordResetToken = createHash('sha256').update(resetToken).digest('hex')
		this.passwordResetTokenExpiresIn = new Date().getTime() + 10 * 60 * 1000
		return this.passwordResetToken
	}
	/** Compares the raw password provided by the user with the hashed password stored in the database */
	public async comparePassword(password: string, dbPasswordHash: string): Promise<boolean> {
		const isMatch = await compare(password, dbPasswordHash)
		return isMatch
	}
}
export const UserModel = getModelForClass(User)
