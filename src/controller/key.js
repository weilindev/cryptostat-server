import BaseService from '../service/base.js'
import { Key } from '../models/db/key.js'
import { errorLog } from '../logger/index.js'
import ResHelper from '../helper/response.js'

const KeyController = {
	create: async (payload, callback) => {
		try {
			const savedDoc = await BaseService.create(Key, payload)
			return callback(ResHelper.successResponse(savedDoc))
		} catch (err) {
			if (err.name === 'CustomError') {
				return callback(ResHelper.failResponse(err.data))
			}
			errorLog(err)
			return callback(ResHelper.unexpectErrorResponse(err))
		}
	},
}

export default KeyController