import { User } from '~models/user.model'

export interface IUser extends User {
	_id: string
}
