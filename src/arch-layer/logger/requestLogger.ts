import morgan, { StreamOptions } from 'morgan';
import logger from './logger';

// Define stream for Morgan to use Winston
const stream: StreamOptions = {
  write: (message) => logger.http(message.trim()), // use custom http level
};

// Skip logging in test environment
const skip = () => {
  const env = process.env.NODE_ENV || 'dev';
  return env === 'test';
};

// Morgan middleware
const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

export default requestLogger;