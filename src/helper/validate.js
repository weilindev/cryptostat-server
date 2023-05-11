import Ajv from 'ajv'
import { isValidObjectId } from 'mongoose'

const ajv = new Ajv()

ajv.addFormat('mongoObjectId', {
  validate: value => {
    try {
      return isValidObjectId(value)
    } catch (err) {
      return false;
    }
  },
})

export const validateUserRegisterPayload = ajv.compile({
	type: 'object',
	properties: {
		email: { type: 'string' },
		firstName: { type: 'string' },
		lastName: { type: 'string' },
		pwd: { type: 'string' },
		pwdConfirm: { type: 'string' },
	},
	required: ["email", "firstName", "lastName", "pwd", "pwdConfirm"],
  additionalProperties: false,
})

export const validateUserLoginPayload = ajv.compile({
	type: 'object',
	properties: {
		email: { type: 'string' },
		pwd: { type: 'string' },
	},
	required: ["email", "pwd"],
  additionalProperties: false,
})

export const validateUserChangePwdPayload = ajv.compile({
	type: 'object',
	properties: {
		pwd: { type: 'string' },
		newPwd: { type: 'string' },
		newPwdConfirm: { type: 'string' },
	},
	required: ["pwd", "newPwd", "newPwdConfirm"],
  additionalProperties: false,
})

export const validateUserForgetPwdPayload = ajv.compile({
	type: 'object',
	properties: {
		email: { type: 'string' },
	},
	required: ["email"],
  additionalProperties: false,
})

export const validateUserForgetResetPwdPayload = ajv.compile({
	type: 'object',
	properties: {
		newPwd: { type: 'string' },
		newPwdConfirm: { type: 'string' },
	},
	required: ["newPwd", "newPwdConfirm"],
  additionalProperties: false,
})

export const validateKeyCreatePayload = ajv.compile({
	type: 'object',
	properties: {
		apiKey: { type: 'string' },
		secretKey: { type: 'string' },
	},
	required: ["apiKey", "secretKey"],
  additionalProperties: false,
})
export const validateUserUpdatePayload = ajv.compile({
	type: 'object',
	properties: {
		firstName: { type: 'string' },
		lastName: { type: 'string' },
	},
  additionalProperties: false,
})
