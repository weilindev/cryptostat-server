export const VALIDATE_ERROR = msg => ({
	code: 1,
	msg,
})
export const MISSING_QUERY = msg => ({
	code: 2,
	msg: `missing query: ${msg}`
})

export const PWD_CONFIRM_MISMATCH = {
	code: 100,
	msg: 'password confirm mismatch'
}
export const ACCOUNT_EXIST = {
	code: 101,
	msg: 'account already exist'
}
export const ACCOUNT_NOT_FOUND = {
	code: 102,
	msg: 'account not found'
}
export const ACCOUNT_NOT_VERIFIED = {
	code: 103,
	msg: 'account is not verified'
}
export const PWD_INVALID = {
	code: 104,
	msg: 'password incorrect'
}
export const VERIFY_CODE_INVALID = {
	code: 105,
	msg: 'verify code expired'
}
export const USER_INFO_NOT_FOUND = {
	code: 106,
	msg: 'user info not found'
}
export const KEY_NOT_FOUND = {
	code: 110,
	msg: 'key not found'
}
