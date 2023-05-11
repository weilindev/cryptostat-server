import express from 'express'

import UserController from '../../controller/user.js'
import ResHelper from '../../helper/response.js'
import * as apiMessage from '../../models/message.js'
import {
	validateUserRegisterPayload,
	validateUserLoginPayload,
	validateUserChangePwdPayload,
	validateUserForgetPwdPayload,
	validateUserForgetResetPwdPayload,
	validateUserUpdatePayload,
} from '../../helper/validate.js'

const router = express.Router()

router.route('/register')

	.post((req, res) => {
		const valid = validateUserRegisterPayload(req.body)
		if (!valid) {
			const msg = validateUserRegisterPayload.errors[0].message
			return res.status(400).send(ResHelper.failResponse(apiMessage.VALIDATE_ERROR(msg)))
		}
		if (req.body.pwd !== req.body.pwdConfirm)
			return res.status(400).send(ResHelper.failResponse(apiMessage.PWD_CONFIRM_MISMATCH))
		const payload = {
			email: req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			pwd: req.body.pwd,
			pwdConfirm: req.body.pwdConfirm,
		}
		UserController.register(payload, async response => {
			if (response.success) res.status(200).send(response)
			else res.status(400).send(response)
		})
	})

router.route('/verify/:code')

	.get((req, res) => {
		UserController.verify(req.params.code, response => {
			if (response.success) res.status(200).send(response)
			else res.status(400).send(response)
		})
	})

router.route('/login')

	.post((req, res) => {
		const valid = validateUserLoginPayload(req.body)
		if (!valid) {
			const msg = validateUserLoginPayload.errors[0].message
			return res.status(400).send(ResHelper.failResponse(apiMessage.VALIDATE_ERROR(msg)))
		}
		const payload = {
			email: req.body.email,
			pwd: req.body.pwd
		}
		UserController.login(payload, response => {
			if (response.success) res.status(200).send(response)
			else res.status(400).send(response)
		})
	})

router.route('/changepassword')

	.put((req, res) => {
		const valid = validateUserChangePwdPayload(req.body)
		if (!valid) {
			const msg = validateUserChangePwdPayload.errors[0].message
			return res.status(400).send(ResHelper.failResponse(apiMessage.VALIDATE_ERROR(msg)))
		}
		if (req.body.newPwd !== req.body.newPwdConfirm)
			return res.status(400).send(ResHelper.failResponse(apiMessage.PWD_CONFIRM_MISMATCH))
		const payload = {
			userId: req.auth.id,
			pwd: req.body.newPwd
		}
		UserController.changePwd(payload, response => {
			if (response.success) res.status(200).send(response)
			else res.status(400).send(response)
		})
	})

router.route('/delete')

	.delete((req, res) => {
		UserController.deleteAccount(req.auth.id, response => {
			if (response.success) res.status(200).send(response)
			else res.status(400).send(response)
		})
	})

router.route('/forgetpassword')

	.put((req, res) => {
		const valid = validateUserForgetPwdPayload(req.body)
		if (!valid) {
			const msg = validateUserForgetPwdPayload.errors[0].message
			return res.status(400).send(ResHelper.failResponse(apiMessage.VALIDATE_ERROR(msg)))
		}
		UserController.forgetPwd(req.body.email, response => {
			if (response.success) res.status(200).send(response)
			else res.status(400).send(response)
		})
	})

router.route('/forgetresetpassword/:code')

	.put((req, res) => {
		const valid = validateUserForgetResetPwdPayload(req.body)
		if (!valid) {
			const msg = validateUserForgetResetPwdPayload.errors[0].message
			return res.status(400).send(ResHelper.failResponse(apiMessage.VALIDATE_ERROR(msg)))
		}
		if (req.body.newPwd !== req.body.newPwdConfirm)
			return res.status(400).send(ResHelper.failResponse(apiMessage.PWD_CONFIRM_MISMATCH))
		const payload = {
			code: req.params.code,
			pwd: req.body.newPwd,
		}
		UserController.forgetResetPwd(payload, response => {
			if (response.success) res.status(200).send(response)
			else res.status(400).send(response)
		})
	})

router.route('/')

	.get((req, res) => {
		const userId = req.auth.id
		UserController.getUserInfo(userId, response => {
			if (response.success) res.status(200).send(response)
			else res.status(400).send(response)
		})
	})

router.route('/:id')

	.patch((req, res) => {
		const valid = validateUserUpdatePayload(req.body)
		if (!valid) {
			const msg = validateUserUpdatePayload.errors[0].message
			return res.status(400).send(ResHelper.failResponse(apiMessage.VALIDATE_ERROR(msg)))
		}
		const userId = req.params.id
		const payload = {
			...(req.body.firstName && { firstName: req.body.firstName }),
			...(req.body.lastName && { lastName: req.body.lastName }),
		}
		UserController.updateUser(userId, payload, response => {
			if (response.success) res.status(200).send(response)
			else res.status(400).send(response)
		})
	})

export default router