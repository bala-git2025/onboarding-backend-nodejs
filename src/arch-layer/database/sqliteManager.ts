import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import environments from '../config/config';
import logger from '../logger/logger';

export class SqliteManager {
  private db: Database | null = null;

  constructor() {}

  public async connect(): Promise<void> {
    try {
      this.db = await open({
        filename: environments.db.sqliteFile!,
        driver: sqlite3.Database,
      });
    } catch (err) {
      logger.error('❌ SQLite connection failed: %o', err);
      throw err;
    }
  }

  public async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      logger.info('🔌 SQLite connection closed');
    }
  }

  public async executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
    if (!this.db) throw new Error('SQLite not connected');
    try {
      const result = await this.db.all<T[]>(query, params);
      return result;
    } catch (err) {
      logger.error('❌ SQLite query failed: %o', err);
      throw err;
    }
  }

  public async executeWrite<T>(query: string, params: any[] = []): Promise<T[]> {
    if (!this.db) throw new Error('SQLite not connected');
    try {
      await this.db.run(query, params);
      return [];
    } catch (err) {
      logger.error('❌ SQLite write failed: %o', err);
      throw err;
    }
  }
}
