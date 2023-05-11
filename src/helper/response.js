const ResHelper = {
	successResponse: payload => ({
		success: true,
		extras: payload,
	}),
	failResponse: payload => ({
		success: false,
		error: payload,
	}),
	unexpectErrorResponse: err => ({
		success: false,
		error: {
			code: 0,
			msg: err.message
		},
	}),
}

export default ResHelper