import { mongoose } from '@typegoose/typegoose'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { connect } from 'mongoose'
import { join } from 'path'
import { argv } from 'process'

import { TourModel } from '~models/tour.model'
import { getEnv } from '~utils/getEnv'

dotenv.config({ path: `${process.cwd()}/config.env` })
const DB_URL = getEnv('DATABASE_URL').replace(
	'<PASSWORD>',
	getEnv('DATABASE_PASSWORD')
)
connect(DB_URL, { autoIndex: true }, result => {
	if (result) return console.info(result.message)
	console.info('Connected to database')
})
const displayHelpInfo = () => {
	console.info('--clean : Clean database\n--import : Import data')
}
const dbSeed = async () => {
	const tours = JSON.parse(
		readFileSync(join(process.cwd(), 'dev-data/data/tours.json'), 'utf-8')
	) as any[]
	const toursWithId = tours.map(tour => ({
		...tour,
		_id: new mongoose.Types.ObjectId(tour._id),
	}))
	if (argv.includes('-h') || argv.includes('--help')) {
		displayHelpInfo()
	}
	if (argv.includes('--clean')) {
		await TourModel.deleteMany()
		console.info(`Successfully removed all data`)
	}
	if (argv.includes('--import')) {
		await TourModel.insertMany([...toursWithId])
		console.info('Successfully inserted data')
	}
}
dbSeed()
