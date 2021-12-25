/* eslint-disable no-console */
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { connect } from 'mongoose'
import { join } from 'path'
import { argv } from 'process'

import { ReviewModel } from '~models/review.model'
import { TourModel } from '~models/tour.model'
import { UserModel } from '~models/user.model'
import { getEnv } from '~utils/getEnv'

dotenv.config({ path: `${process.cwd()}/config.env` })

const DB_URL = getEnv('DATABASE_URL').replace('<PASSWORD>', getEnv('DATABASE_PASSWORD'))
connect(DB_URL, { autoIndex: true }, result => {
	if (result) return console.info(result.message)
	console.info('Connected to database')
})
const displayHelpInfo = () => {
	console.info('--clean : Clean database\n--seed : Import data')
}
type ModelName = 'tours' | 'reviews' | 'users'

const getData = (name: ModelName): unknown[] => {
	const path = join(process.cwd(), `dev-data/data/${name}.json`)
	return JSON.parse(readFileSync(path, 'utf-8'))
}
const seedData = async () => {
	await TourModel.create(getData('tours'))
	await UserModel.create(getData('users'), { validateBeforeSave: false })
	await ReviewModel.create(getData('reviews'))
	console.info('Successfully imported data')
}
const deleteData = async () => {
	await TourModel.deleteMany()
	await UserModel.deleteMany()
	await ReviewModel.deleteMany()
	console.info('Successfully deleted data')
}
;(async () => {
	if (argv.includes('-h') || argv.includes('--help')) {
		displayHelpInfo()
	}
	if (argv.includes('--seed')) {
		seedData()
	}
	if (argv.includes('--clean')) {
		deleteData()
	}
})()
