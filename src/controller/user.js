import crypto from 'crypto'
import moment from 'moment'
import jwt from 'jsonwebtoken'

import BaseService from '../service/base.js'
import UserService from '../service/user.js'
import MailService from '../service/mailer.js'
import { User } from '../models/db/user.js'
import { errorLog } from '../logger/index.js'
import * as apiMessage from '../models/message.js'
import ResHelper from '../helper/response.js'
import CustomError from '../helper/customError.js'

const UserController = {
	register: async (payload, callback) => {
		try {
			const user = await User.exists({ email: payload.email }).exec()
			if (user) throw CustomError(apiMessage.ACCOUNT_EXIST)

			const pwdSalt = crypto.randomUUID()
			const pwdHash = UserService.hashPassword(payload.pwd, pwdSalt)

			const createPayload = {
				email: payload.email,
				firstName: payload.firstName,
				lastName: payload.lastName,
				pwdSalt,
				pwdHash,
				verifyCode: crypto.randomBytes(16).toString('hex'),
				verifyExpiredAt: moment().add(3, 'd').toDate(),
			}

			const savedDoc = await BaseService.create(User, createPayload)
			const response = {
				_id: savedDoc._id,
				email: savedDoc.email,
				firstName: savedDoc.firstName,
				lastName: savedDoc.lastName,
			}

			// send mail
			const mailPayload = {
				link: `${process.env.DOMAIN}/verify/${savedDoc.verifyCode}`
			}
			await MailService.sendUserVerifyMail(savedDoc.email, mailPayload)
			return callback(ResHelper.successResponse(response))
		} catch (err) {
			// expected custom error
			if (err.name === 'CustomError') {
				return callback(ResHelper.failResponse(err.data))
			}
			// unexpected error: log and return
			errorLog(err)
			return callback(ResHelper.unexpectErrorResponse(err))
		}
	},
	login: async (payload, callback) => {
		try {
			const user = await User.findOne({ email: payload.email }).exec()
			if (!user) throw CustomError(apiMessage.ACCOUNT_NOT_FOUND)
			if (!user.verified) throw CustomError(apiMessage.ACCOUNT_NOT_VERIFIED)

			const pwdHash = UserService.hashPassword(payload.pwd, user.pwdSalt)
			if (pwdHash.toString() !== user.pwdHash.toString()) throw CustomError(apiMessage.PWD_INVALID)

			const userProfile = {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
			}

			const token = jwt.sign(
				userProfile,
				process.env.JWT_SECRET,
				{ expiresIn: '1d' },
			)

			return callback(ResHelper.successResponse({ userProfile, token }))
		} catch (err) {
			if (err.name === 'CustomError') {
				return callback(ResHelper.failResponse(err.data))
			}
			errorLog(err)
			return callback(ResHelper.unexpectErrorResponse(err))
		}
	},
	verify: async (code, callback) => {
		try {
			const user = await User.findOne({ verifyCode: code }).exec()
			if (!user) throw CustomError(apiMessage.ACCOUNT_NOT_FOUND)
			const ifCodeExpired = moment().isAfter(user.verifyExpiredAt, 'second')
			if (ifCodeExpired) throw CustomError(apiMessage.VERIFY_CODE_INVALID)

			user.verified = true
			user.verifyCode = undefined
			user.verifyExpiredAt = undefined
			const savedUser = await user.save()
			const content = {
				id: savedUser._id,
				email: savedUser.email,
			}

			return callback(ResHelper.successResponse(content))
		} catch (err) {
			if (err.name === 'CustomError') {
				return callback(ResHelper.failResponse(err.data))
			}
			errorLog(err)
			return callback(ResHelper.unexpectErrorResponse(err))
		}
	},
	changePwd: async (payload, callback) => {
		const { userId, pwd } = payload
		try {
			const user = await User.findById(userId).exec()
			if (!user) throw CustomError(apiMessage.ACCOUNT_NOT_FOUND)

			const pwdSalt = crypto.randomUUID()
			const pwdHash = UserService.hashPassword(pwd, pwdSalt)

			user.pwdSalt = pwdSalt
			user.pwdHash = pwdHash
			await user.save()

			return callback(ResHelper.successResponse())
		} catch (err) {
			if (err.name === 'CustomError') {
				return callback(ResHelper.failResponse(err.data))
			}
			errorLog(err)
			return callback(ResHelper.unexpectErrorResponse(err))
		}
	},
	deleteAccount: async (id, callback) => {
		try {
			await User.findByIdAndDelete(id).exec()
			return callback(ResHelper.successResponse())
		} catch (err) {
			if (err.name === 'CustomError') {
				return callback(ResHelper.failResponse(err.data))
			}
			errorLog(err)
			return callback(ResHelper.unexpectErrorResponse(err))
		}
	},
	forgetPwd: async (email, callback) => {
		try {
			const user = await User.findOne({ email }).exec()
			if (!user) throw CustomError(apiMessage.ACCOUNT_NOT_FOUND)

			user.genForgotPwd()
			await user.save()
			return callback(ResHelper.successResponse())
		} catch (err) {
			if (err.name === 'CustomError') {
				return callback(ResHelper.failResponse(err.data))
			}
			errorLog(err)
			return callback(ResHelper.unexpectErrorResponse(err))
		}
	},
	forgetResetPwd: async (payload, callback) => {
		const { code, pwd } = payload
		try {
			const user = await User.findOne({ forgetCode: code }).exec()
			if (!user) throw CustomError(apiMessage.ACCOUNT_NOT_FOUND)
			const ifCodeExpired = moment().isAfter(user.forgetExpiredAt, 'second')
			if (ifCodeExpired) throw CustomError(apiMessage.VERIFY_CODE_INVALID)

			const pwdSalt = crypto.randomUUID()
			const pwdHash = UserService.hashPassword(pwd, pwdSalt)
			const newPayload = {
				$set: {
					pwdSalt,
					pwdHash,
				},
				$unset: {
					forgetCode: 1,
					forgetExpiredAt: 1,
				},
			}
			
			await User.findByIdAndUpdate(user._id, { ...newPayload }).exec()
			return callback(ResHelper.successResponse())
		} catch (err) {
			if (err.name === 'CustomError') {
				return callback(ResHelper.failResponse(err.data))
			}
			errorLog(err)
			return callback(ResHelper.unexpectErrorResponse(err))
		}
	},
	updateUser: async (userId, payload, callback) => {
		try {			
			const updatedDoc = await User.findByIdAndUpdate(
				userId,
				{ ...payload },
				{ new: true, select: 'firstName lastName' }
			)
				.exec()
			if (!updatedDoc) throw CustomError(apiMessage.ACCOUNT_NOT_FOUND)

			return callback(ResHelper.successResponse(updatedDoc))
		} catch (err) {
			if (err.name === 'CustomError') {
				return callback(ResHelper.failResponse(err.data))
			}
			errorLog(err)
			return callback(ResHelper.unexpectErrorResponse(err))
		}
	},
	getUserInfo: async (userId, callback) => {
		try {
			const user = await User.findById(userId).exec()
			const result = {
				name: `${user?.firstName} ${user?.lastName}` ?? '',
				account: user?.email ?? '',
			}
			return callback(ResHelper.successResponse(result))
		} catch {
			errorLog(err)
			return callback(ResHelper.unexpectErrorResponse(err))
		}
	}
}

export default UserController