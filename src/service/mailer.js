import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import path from 'path'
import fs from 'fs-extra'
import Mustache from 'mustache'


const appRoot = path.resolve()
const credentials = fs.readJsonSync(`${appRoot}/aws-manage-key/config.json`)
const client = new SESClient({
	region: process.env.REGION,
	credentials,
})

const getMailParams = (emailto, html, subject) => ({
	Source: `cryptostat <${process.env.SENDER_EMAIL}>`,
	Destination: {
		ToAddresses: [emailto]
	},
	Message: {
		Body: {
			Html: {
				Charset: 'UTF-8',
				Data: html
			},
		},
		Subject: {
			Charset: 'UTF-8',
			Data: subject
		}
	},
})

const MailService = {
	sendTestMail: async email => {
		const mustacheTemp = await fs.readFile(`${appRoot}/views/mailtemplates/test.temp.html`, 'UTF-8')
		const htmlContent = Mustache.render(mustacheTemp.toString(), {})
		const mailParams = getMailParams(email, htmlContent, '【cryptostat】Test Mail')
		try {
			await client.send(new SendEmailCommand(mailParams))
			return
		}
		catch (err) {
			throw err
		}
	},
	sendUserVerifyMail: async (email, payload) => {
		const mustacheTemp = await fs.readFile(`${appRoot}/views/mailtemplates/userVerify.temp.html`, 'UTF-8')
		const htmlContent = Mustache.render(mustacheTemp.toString(), { ...payload })
		const mailParams = getMailParams(email, htmlContent, '【cryptostat】會員開通信')
		try {
			await client.send(new SendEmailCommand(mailParams))
			return
		}
		catch (err) {
			throw err
		}
	}
}

export default MailService
