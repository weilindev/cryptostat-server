import { Schema, model } from "mongoose"
import moment from 'moment'
import crypto from 'crypto'

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	pwdSalt: String,
	pwdHash: String,
	verified: {
		type: Boolean,
		default: false,
		required: true,
	},
	verifyCode: String,
	verifyExpiredAt: Date,
	forgetCode: String,
	forgetExpiredAt: Date,
}, { timestamps: true })

userSchema.methods.genForgotPwd = function () {
	this.forgetCode = crypto.randomBytes(16).toString('hex')
	this.forgetExpiredAt = moment().add(15, 'minutes').toDate()
}

userSchema.index({ email: 1 })
userSchema.index({ verifyCode: 1 })
userSchema.index({ forgetCode: 1 })

export const User = model('User', userSchema)