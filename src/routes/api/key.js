import express from 'express'

import KeyController from '../../controller/key.js'
import ResHelper from '../../helper/response.js'
import * as apiMessage from '../../models/message.js'
import {
	validateKeyCreatePayload,
} from '../../helper/validate.js'

const router = express.Router()

router.route('/')

	.post((req, res) => {
		const valid = validateKeyCreatePayload(req.body)
		if (!valid) {
			const msg = validateKeyCreatePayload.errors[0].message
			return res.status(400).send(ResHelper.failResponse(apiMessage.VALIDATE_ERROR(msg)))
		}
		const payload = {
			userId: req.auth.id,
			apiKey: req.body.apiKey,
			secretKey: req.body.secretKey,
		}
		KeyController.create(payload, response => {
			if (response.success) res.status(200).send(response)
			else res.status(400).send(response)
		})
	})

export default router