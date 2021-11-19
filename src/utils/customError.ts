import { IError } from '~typings/error.interface'

export class CustomError extends Error implements IError {
    statusCode: number
    status: string
    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'

        Error.captureStackTrace(this, this.constructor)
    }
}
