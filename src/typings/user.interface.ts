import { Role } from '~typings/role.enum'

export interface IUser {
	id: string
	_id: string
	name: string
	email: string
	photo?: string
	password: string
	passwordConfirm?: string
	passwordChangedAt?: Date
	role: Role
}
