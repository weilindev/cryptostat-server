import express from 'express'
import redis from 'redis'
import expressSession from 'express-session'
import RedisStore from "connect-redis"
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'

import routes from './routes/index.js'

dotenv.config()
const app = express()
const port = 5000

const redisClient = redis.createClient()
redisClient.connect().catch(console.error)
const redisStore = new RedisStore({
	client: redisClient,
	prefix: 'cryptostat:'
})

mongoose.set("strictQuery", false);
mongoose.connect(
	process.env.MONGODB_URL,
	{ useNewUrlParser: true },
	(err) => {
	console.log('connected to mongoDB.')
	if (err) console.error(err)
})

app.use(
  expressSession({
    store: redisStore,
    secret: process.env.REDIS_SECRET,
    resave: false,
    saveUninitialized: false,
		cookie: { secure: true, maxAge: 3600000 },
  })
)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

routes(app)

app.listen(port, () => {
	console.log(`server running on port ${port}.`);
});