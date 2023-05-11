const BaseService = {
	create: async (model, payload) => {
		const newDoc = new model({ ...payload })
		return await newDoc.save()
	},
}

export default BaseService