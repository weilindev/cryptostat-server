import https from 'https'

const ReqHelper = {
	makeRequest: async payload => {
		const {
			params,
			apiKey,
			hostname,
			path,
			method,
		} = payload

		const options = {
			hostname,
			path,
			method,
			headers: {
				'X-MBX-APIKEY': apiKey,
				'Content-Type': 'application/x-www-form-urlencoded',
				...(params && { 'Content-Length': params.toString().length})
			}
		}

		return new Promise((resolve, reject) => {
			const request = https.request(options, response => {
				let responseData = ''

				response.on('data', chunk => {
					responseData += chunk;
				});

				response.on('end', () => {
					const result = JSON.parse(responseData)
					return resolve(result)
				})
			})

			request.on('error', err => {
				reject(err)
			})
			
			if (params && method === 'POST') request.write(params.toString())
			request.end()
		})
	},
}

export default ReqHelper