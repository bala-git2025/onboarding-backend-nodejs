import { createLogger, format, transports } from 'winston';
import environments from '../config/config';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logger = createLogger({
  levels,
  level: environments.logger.level,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'onboarding-backend' },
  transports: [
    ...(environments.logger.console
      ? [
          new transports.Console({
            format: format.combine(format.colorize(), format.simple()),
          }),
        ]
      : []),
    ...(environments.logger.file
      ? [
          new transports.File({
            filename: `${environments.logger.filePath}/error.log`,
            level: 'error',
          }),
          new transports.File({
            filename: `${environments.logger.filePath}/combined.log`,
          }),
        ]
      : []),
  ],
});

export default logger;