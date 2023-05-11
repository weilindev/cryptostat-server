import userRoutes from './api/user.js'
import keyRoutes from './api/key.js'
import binanceRoutes from './api/binance.js'
import verifyUserToken from '../middleware/verifyToken.js'

const Routes = app => {
	app.use('/api/user', [verifyUserToken()], userRoutes)
	app.use('/api/key', [verifyUserToken()], keyRoutes)
	app.use('/api/binance', [verifyUserToken()], binanceRoutes)
}

export default Routes