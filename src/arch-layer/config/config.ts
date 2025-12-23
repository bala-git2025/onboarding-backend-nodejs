import dotenvFlow from 'dotenv-flow';
import { EnvironmentConfig } from './configModel';

dotenvFlow.config(); // automatically loads .env.<NODE_ENV>

// Helpers for parsing
const parseBoolean = (value: string | undefined, defaultValue = false): boolean => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
};

const parseNumber = (value: string | undefined, defaultValue: number): number => {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

const environments: EnvironmentConfig = {
  server: {
    port: parseNumber(process.env.PORT, 5000),
    env: (process.env.NODE_ENV as 'dev' | 'test' | 'prod') || 'dev',
  },
  db: {
    type: (process.env.DB_TYPE as 'postgres' | 'sqlite') || 'sqlite',
    host: process.env.DB_HOST, // optional for sqlite
    port: process.env.DB_PORT ? parseNumber(process.env.DB_PORT, 5432) : undefined,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    sqliteFile: process.env.SQLITE_FILE, // used only if type=sqlite
  },
  logger: {
    level: (process.env.LOGGER_LEVEL as 'info' | 'warn' | 'error' | 'debug') || 'info',
    console: parseBoolean(process.env.LOGGER_CONSOLE, true),
    file: parseBoolean(process.env.LOGGER_FILE, true),
    filePath: process.env.LOGGER_FILE_PATH || 'logs',
  },
};

export default environments;