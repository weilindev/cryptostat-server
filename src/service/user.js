import crypto from 'crypto'

const UserService = {
	hashPassword: (pwd, salt) => {
		const iteration = 21400
		const keylen = 175
		return crypto.pbkdf2Sync(
			pwd,
			salt,
			iteration,
			keylen,
			'sha512',
		)
	}
}

export default UserService