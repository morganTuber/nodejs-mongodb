import { createTransport, SendMailOptions } from 'nodemailer'

import { IEmailOptions } from '~typings/emailOptions.interface'
import { getEnv } from '~utils/getEnv'

export const sendEmail = async (options: IEmailOptions): Promise<void> => {
    const transport = createTransport({
        host: getEnv('EMAIL_HOST'),
        port: +getEnv('EMAIL_PORT'),
        auth: {
            user: getEnv('EMAIL_USERNAME'),
            pass: getEnv('EMAIL_PASSWORD'),
        },
    })
    const mailOptions: SendMailOptions = {
        from: 'Optimus Prime <optimusprime@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.text,
    }
    await transport.sendMail(mailOptions)
}
