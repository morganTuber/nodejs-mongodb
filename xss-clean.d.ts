import { RequestHandler } from 'express'

declare module 'xss-clean' {
	/** Middleware to remove xss code from request */
	export default function cleanXss(): RequestHandler
}
