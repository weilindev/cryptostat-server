import { expressjwt as jwt } from 'express-jwt'

const NON_AUTH_USER_ROUTE = [
	'/api/user/welcome',
	'/api/user/register',
	'/api/user/login',
	'/api/user/forgetpassword',
	/^\/api\/user\/verify\/.*/,
	/^\/api\/user\/forgetresetpassword\/.*/,
]

const verifyUserToken = () => jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }).unless({ path: NON_AUTH_USER_ROUTE})

export default verifyUserToken
