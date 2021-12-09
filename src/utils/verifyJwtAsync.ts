import jwt from 'jsonwebtoken'

import { getEnv } from '~utils/getEnv'

export const verifyJwtAsync = <T extends jwt.JwtPayload>(token: string): Promise<T> => {
	const JWT_SECRET = getEnv('JWT_SECRET_KEY')
	return new Promise((resolve, reject) => {
		jwt.verify(token, JWT_SECRET, (error, data) => {
			if (error) {
				reject('Invalid Token')
			} else {
				resolve(data as T)
			}
		})
	})
}
