import * as winston from 'winston'
import 'winston-daily-rotate-file'
import path from 'path'

const dirname = path.join(path.resolve(), '/logs')

const transport = new winston.transports.DailyRotateFile({
  filename: 'app-%DATE%.log',
	dirname,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint(),
  ),
	transports: [transport]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export const errorLog = err => logger.log({
	level: 'error',
	message: `[${err.name}] ${err.message}`,
})
