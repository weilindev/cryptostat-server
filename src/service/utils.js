import crypto from 'crypto'

const UtilsService = {
	getSignature: (secret, message) => {
		return crypto.createHmac('sha256', secret).update(message).digest('hex')
	}
}

export default UtilsService