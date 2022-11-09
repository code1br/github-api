const morgan = require('morgan');
export const logger = require('../utils/logger');

const stream = {
	write: (message: 'message') => logger.http(message),
};

const skip = () => {
	const env = process.env.NODE_ENV || 'development';
	return env !== 'development';
};

const morganMiddleware = morgan(
	':remote-addr :method :url :status :res[content-length] - :response-time ms',
	{ stream, skip }
);

module.exports = morganMiddleware;
