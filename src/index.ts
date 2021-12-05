/* eslint-disable no-console */
import dotenv from 'dotenv'
import express from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import expressRateLimit from 'express-rate-limit'
import helmet from 'helmet'
import hpp from 'hpp'
import { connect } from 'mongoose'
import morgan from 'morgan'
import reviewRouter from 'src/routes/review.routes'
import viewsRouter from 'src/routes/view.routes'
import xssClean from 'xss-clean'

import { globalErrors } from '~middlewares/globalErrors'
import { CustomError } from '~utils/customError'
import { getEnv } from '~utils/getEnv'

import tourRouter from './routes/tour.routes'
import userRouter from './routes/user.route'
//configure dotenv
dotenv.config({ path: `${process.cwd()}/config.env` })

const PORT = process.env.PORT || 4000

//db credentials
const DB_URL = getEnv('DATABASE_URL').replace('<PASSWORD>', getEnv('DATABASE_PASSWORD'))

//express app instance
const app = express()

//set the templating engine
app.set('view engine', 'pug')
app.set('views', `${process.cwd()}/src/views`)
//connect to the mongodb database
connect(DB_URL, { autoIndex: true }, result => {
	if (result) return console.log(result.message)
	console.log('✔️ Successfully connected to the database')
})

//middlewares
//middleware to set global security headers
app.use(helmet())
//only enable logging when in development
process.env.NODE_ENV === 'development' && app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
//middleware to parse req.body
app.use(express.json({ limit: '10kb' }))
//middleware to sanitize data against noSQL injection
app.use(mongoSanitize())
//middleware to sanitize data against XSS
app.use(xssClean())
//middleware to serve static files
//middleware to prevent parameter pollution
app.use(
	hpp({
		whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'difficulty', 'price'],
	})
)
app.use(express.static(`${process.cwd()}/public`))
//rate limiting middleware
app.use(
	'/api',
	expressRateLimit({
		max: 100,
		windowMs: 60 * 60 * 1000,
		message: 'Too many requests.Please try again after one hour',
	})
)

//register routes
//view routes
app.use('/', viewsRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

//handle invalid routes
app.all('*', (req, _res, next) => {
	const error = new CustomError(
		` Route ${req.originalUrl} doesn't exist on this server`,
		400
	)
	next(error)
})
//global error handling middleware
app.use(globalErrors)
//start the server
const server = app.listen(PORT, () =>
	console.log(`🚀 Server started on http://localhost:${PORT}`)
)
process.on('unhandledRejection', (error: Record<string, string>) => {
	if (error) {
		console.log(`${error.name} - ${error.message}`)
		server.close(() => process.exit(1))
	}
})
