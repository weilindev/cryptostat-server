import { Schema, model } from "mongoose"

const keySchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		unique: true,
		required: true,
	},
	apiKey: {
		type: String,
		unique: true,
		trim: true,
		required: true,
	},
	secretKey: {
		type: String,
		unique: true,
		trim: true,
		required: true,
	},
}, { timestamps: { createdAt: true, updatedAt: false } })

keySchema.index({ userId: 1 })

export const Key = model('Key', keySchema)