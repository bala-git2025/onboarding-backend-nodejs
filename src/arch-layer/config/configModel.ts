export interface ServerConfig {
  port: number;
  env: 'dev' | 'test' | 'prod';
}

export interface DbConfig {
  type: 'postgres' | 'sqlite';
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  sqliteFile?: string;
}

export interface LoggerConfig {
  level: 'info' | 'warn' | 'error' | 'debug';
  console: boolean;
  file: boolean;
  filePath: string;
}

export interface EnvironmentConfig {
  server: ServerConfig;
  db: DbConfig;
  logger: LoggerConfig;
}