import environments from '../config/config';
import { PostgresManager } from './postgresManager';
import { SqliteManager } from './sqliteManager';

export class DBManager {
  private postgres: PostgresManager | null = null;
  private sqlite: SqliteManager | null = null;

  constructor() {
    if (environments.db.type === 'postgres') {
      this.postgres = new PostgresManager();
    } else {
      this.sqlite = new SqliteManager();
    }
  }

  public async connect(): Promise<void> {
    if (this.postgres) {
      await this.postgres.checkDbConnection();
    } else if (this.sqlite) {
      await this.sqlite.connect();
      // SQLite Locking Fixes
      await this.sqlite.executeWrite('PRAGMA journal_mode = WAL;', []);
      await this.sqlite.executeWrite('PRAGMA busy_timeout = 5000;', []);
    }
  }

  public async close(): Promise<void> {
    if (this.postgres) {
      await this.postgres.closeDbConnection();
    } else if (this.sqlite) {
      await this.sqlite.close();
    }
  }

  public async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (this.postgres) {
      return this.postgres.executeReadQuery(sql, params);
    } else if (this.sqlite) {
      return this.sqlite.executeQuery(sql, params);
    }
    throw new Error('No database configured');
  }

  public async write<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (this.postgres) {
      return this.postgres.executeWriteQuery(sql, params);
    } else if (this.sqlite) {
      return this.sqlite.executeWrite(sql, params);
    }
    throw new Error('No database configured');
  }

  public async excuteWriteReturn<T>(sql: string, params: any[] = []): Promise<T[]> {
    if(this.sqlite) {
      return this.sqlite.excuteWriteReturning(sql, params);
    }
    throw new Error('No database configured');
  }

}


