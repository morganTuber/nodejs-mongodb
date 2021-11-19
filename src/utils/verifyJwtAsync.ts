import jwt from 'jsonwebtoken'

export const verifyJwtAsync = <T extends jwt.JwtPayload>(
    token: string,
    secret: string
): Promise<T> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error, data) => {
            if (error) {
                reject('Invalid Token')
            } else {
                resolve(data as T)
            }
        })
    })
}
