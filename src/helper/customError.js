const CustomError = data => ({
	name: 'CustomError',
	data,
	__proto: Error.prototype,
})

export default CustomError