import { htmlToText } from 'html-to-text'
import { createTransport as createNodemailerTransport, SendMailOptions } from 'nodemailer'
import { join } from 'path'
import { renderFile } from 'pug'

import { getEnv } from '~utils/getEnv'

interface EmailUser {
	name: string
	email: string
}
export class Email {
	private to: string
	private firstName: string
	private from: string
	constructor(protected readonly user: EmailUser, protected readonly url: string) {
		this.to = `${this.user.name} <${user.email}>`
		this.from = `Optimus Prime <${getEnv('EMAIL_FROM')}>`
		this.firstName = user.name.split(' ')[0]
	}
	private createTransport() {
		return createNodemailerTransport({
			host: getEnv('EMAIL_HOST'),
			port: +getEnv('EMAIL_PORT'),
			auth: {
				user: getEnv('EMAIL_USERNAME'),
				pass: getEnv('EMAIL_PASSWORD'),
			},
		})
	}
	private async send(templateName: string, subject: string) {
		const html = renderFile(join(process.cwd(), `src/views/email/${templateName}.pug`), {
			firstName: this.firstName,
			from: this.from,
			to: this.to,
			url: this.url,
			subject,
		})
		const mailOptions: SendMailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText(html),
		}
		await this.createTransport().sendMail(mailOptions)
	}
	/**
	 * @description Send email message welcoming a new user
	 */
	public async welcome() {
		await this.send('welcome', 'Welcome to Natours')
	}
	/**
	 * @description Send a password reset email
	 */
	public async forgotPassword() {
		await this.send('forgotPassword', 'Forgot your password')
	}
}
