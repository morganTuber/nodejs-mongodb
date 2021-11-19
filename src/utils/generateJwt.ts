import jwt from 'jsonwebtoken'

import { IJwtPayload } from '~typings/jwt-payload.interface'
import { getEnv } from '~utils/getEnv'

export const generateJwt = (payload: IJwtPayload): string => {
    const SECRET_KEY = getEnv('JWT_SECRET_KEY')
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' })
}
