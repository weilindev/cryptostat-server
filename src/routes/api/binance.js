import express from 'express'

import BinanceController from '../../controller/binance.js'
import * as apiMessage from '../../models/message.js'
import ResHelper from '../../helper/response.js'

const router = express.Router()

router.route('/userasset')

	.get((req, res) => {
		const userId = req.auth.id
		BinanceController.getUserAsset(userId, response => {
			if (response.success) res.status(200).send(response)
			else res.status(400).send(response)
		})
	})

router.route('/staking')

	.get((req, res) => {
		if (!req.query?.product) return res.status(400).send(ResHelper.failResponse(apiMessage.MISSING_QUERY('product')))
		const userId = req.auth.id
		const payload = {
			product: req.query.product,
			size: req.query.size || '100',
		}

		BinanceController.stakingPosition(userId, payload, response => {
			if (response.success) res.status(200).send(response)
			else res.status(400).send(response)
		})
	})

router.route('/daily')

	.get((req, res) => {
		const userId = req.auth.id

		BinanceController.dailyPosition(userId, response => {
			if (response.success) res.status(200).send(response)
			else res.status(400).send(response)
		})
	})

export default router