import moment from 'moment'

import { Key } from '../models/db/key.js'
import { errorLog } from '../logger/index.js'
import ResHelper from '../helper/response.js'
import ReqHelper from '../helper/request.js'
import CustomError from '../helper/customError.js'
import * as apiMessage from '../models/message.js'
import UtilsService from '../service/utils.js'

const BinanceController = {
	getUserAsset: async (userId, callback) => {
		try {
			const key = await Key.findOne({ userId }).exec()
			if (!key) throw CustomError(apiMessage.KEY_NOT_FOUND)

			const { apiKey, secretKey } = key
			const timeStamp = moment().valueOf()
			const message = `timestamp=${timeStamp}`
			const signature = UtilsService.getSignature(secretKey, message)

			const params = new URLSearchParams()
			params.append('timestamp', timeStamp)
			params.append('signature', signature)

			const reqPayload = {
				params,
				apiKey,
				hostname: 'api.binance.com',
				path: '/sapi/v3/asset/getUserAsset',
				method: 'POST',
			}

			const result = await ReqHelper.makeRequest(reqPayload)
			if (result.code) throw CustomError(result)
			return callback(ResHelper.successResponse(result))
			
		} catch (err) {
			if (err.name === 'CustomError') {
				return callback(ResHelper.failResponse(err.data))
			}
			errorLog(err)
			return callback(ResHelper.unexpectErrorResponse(err))
		}
	},
	stakingPosition: async (userId, payload, callback) => {
		try {
			const key = await Key.findOne({ userId }).exec()
			if (!key) throw CustomError(apiMessage.KEY_NOT_FOUND)

			const { apiKey, secretKey } = key
			const timeStamp = moment().valueOf()
			const message = `product=${payload.product}&size=${payload.size}&timestamp=${timeStamp}`
			const signature = UtilsService.getSignature(secretKey, message)

			const reqPayload = {
				apiKey,
				hostname: 'api.binance.com',
				path: `/sapi/v1/staking/position?${message}&signature=${signature}`,
				method: 'GET',
			}
			const result = await ReqHelper.makeRequest(reqPayload)
			if (result.code) throw CustomError(result)
			return callback(ResHelper.successResponse(result))
		} catch (err) {
			if (err.name === 'CustomError') {
				return callback(ResHelper.failResponse(err.data))
			}
			errorLog(err)
			return callback(ResHelper.unexpectErrorResponse(err))
		}
	},
	dailyPosition: async (userId, callback) => {
		try {
			const key = await Key.findOne({ userId }).exec()
			if (!key) throw CustomError(apiMessage.KEY_NOT_FOUND)

			const { apiKey, secretKey } = key
			const timeStamp = moment().valueOf()
			const message = `timestamp=${timeStamp}`
			const signature = UtilsService.getSignature(secretKey, message)

			const reqPayload = {
				apiKey,
				hostname: 'api.binance.com',
				path: `/sapi/v1/lending/daily/token/position?${message}&signature=${signature}`,
				method: 'GET',
			}
			const result = await ReqHelper.makeRequest(reqPayload)
			if (result.code) throw CustomError(result)
			return callback(ResHelper.successResponse(result))
		} catch (err) {
			if (err.name === 'CustomError') {
				return callback(ResHelper.failResponse(err.data))
			}
			errorLog(err)
			return callback(ResHelper.unexpectErrorResponse(err))
		}
	},
}

export default BinanceController