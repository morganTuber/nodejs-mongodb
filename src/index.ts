/* eslint-disable no-console */
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import expressRateLimit from 'express-rate-limit'
import helmet from 'helmet'
import hpp from 'hpp'
import { connect } from 'mongoose'
import morgan from 'morgan'
import xssClean from 'xss-clean'

import { globalErrors } from '~middlewares/globalErrors'
import { CustomError } from '~utils/customError'
import { getEnv } from '~utils/getEnv'

import bookingRouter from './routes/booking.routes'
import reviewRouter from './routes/review.routes'
import tourRouter from './routes/tour.routes'
import userRouter from './routes/user.route'
import viewsRouter from './routes/view.routes'

//configure dotenv
dotenv.config({ path: `${process.cwd()}/config.env` })

const PORT = process.env.PORT || '4000'
const URL =
	process.env.NODE_ENV === 'production'
		? `https://morning-ridge-48586.herokuapp.com`
		: `http://localhost:${PORT}`

//db credentials
const DB_URL = getEnv('DATABASE_URL').replace('<PASSWORD>', getEnv('DATABASE_PASSWORD'))

//express app instance
const app = express()

//set the templating engine
app.set('view engine', 'pug')
app.set('views', `${process.cwd()}/src/views`)
//connect to the mongodb database
connect(DB_URL, { autoIndex: true }, error => {
	if (error) return console.log(error.message)
	console.log('✔️ Successfully connected to the database')
})

//middlewares
//implement CORS
app.use(cors())
app.options('*', cors)
//compression for performance gains
app.use(compression())
//middleware to set global security headers
app.use(helmet())
//only enable logging when in development
process.env.NODE_ENV === 'development' && app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
//middleware to parse req.body
app.use(express.json({ limit: '10kb' }))
//middleware to parse cookies
app.use(cookieParser())
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

//middleware for handling single tasks
app.use((req, res, next) => {
	console.log('Middleware ran 🏃‍♂️')
	res.set(
		'Content-Security-Policy',
		"default-src 'self' https://*.mapbox.com https://*.stripe.com/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
	)
	next()
})
//view routes
app.use('/', viewsRouter)
//api routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/bookings', bookingRouter)

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
const server = app.listen(PORT, () => console.log(`🚀 Server started on ${URL}`))

process.on('unhandledRejection', (error: Record<string, string>) => {
	if (error) {
		console.log(`${error.name} - ${error.message}`)
		server.close(() => process.exit(1))
	}
})
//close down the server when it recives sigterm signal from heroku
process.on('SIGTERM', () => {
	console.log('👋 SIGTERM received. Shutting down the server')
	server.close(() => {
		console.log('💥 Process terminated')
	})
})
