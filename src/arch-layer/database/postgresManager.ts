import { Pool, PoolClient, QueryResult } from 'pg';
import environments from '../config/config';
import logger from '../logger/logger';
import { CHECK_CONN_QUERY } from '../../common/queries';

export class PostgresManager {
  private pool: Pool;
  private transactionClient: PoolClient | null = null; // class-level transaction client

  constructor() {
    this.pool = new Pool(environments.db);

    // Graceful shutdown hooks
    process.on('SIGINT', async () => {
      await this.closeDbConnection();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.closeDbConnection();
      process.exit(0);
    });
  }

  /** Check DB connection at startup */
  public async checkDbConnection(): Promise<void> {
    try {
      await this.pool.query(CHECK_CONN_QUERY);
      logger.info('✅ Database connection successful');
    } catch (err) {
      logger.error('❌ Database connection failed: %o', err);
      throw err;
    }
  }

  /** Close pool gracefully */
  public async closeDbConnection(): Promise<void> {
    try {
      await this.pool.end();
      logger.info('🔌 Database pool closed');
    } catch (err) {
      logger.error('❌ Error closing database pool: %o', err);
    }
  }

  /** Begin a transaction */
  public async beginTransaction(): Promise<void> {
    this.transactionClient = await this.pool.connect();
    try {
      await this.transactionClient.query('BEGIN');
      logger.info('🔄 Transaction started');
    } catch (err) {
      this.transactionClient.release();
      this.transactionClient = null;
      logger.error('❌ Failed to start transaction: %o', err);
      throw err;
    }
  }

  /** Commit the current transaction */
  public async commit(): Promise<void> {
    if (!this.transactionClient) {
      throw new Error('No active transaction to commit');
    }
    try {
      await this.transactionClient.query('COMMIT');
      logger.info('✅ Transaction committed');
    } catch (err) {
      logger.error('❌ Failed to commit transaction: %o', err);
      throw err;
    } finally {
      this.transactionClient.release();
      this.transactionClient = null;
    }
  }

  /** Rollback the current transaction */
  public async rollback(): Promise<void> {
    if (!this.transactionClient) {
      throw new Error('No active transaction to rollback');
    }
    try {
      await this.transactionClient.query('ROLLBACK');
      logger.warn('↩️ Transaction rolled back');
    } catch (err) {
      logger.error('❌ Failed to rollback transaction: %o', err);
      throw err;
    } finally {
      this.transactionClient.release();
      this.transactionClient = null;
    }
  }

  /** Execute a read-only query (SELECT, etc.) outside transaction */
  public async executeReadQuery<T>(query: string, params: any[] = []): Promise<T[]> {
    try {
      const result: QueryResult = await this.pool.query(query, params);
      return result.rows as T[];
    } catch (err) {
      logger.error('❌ Read query execution failed: %o', err);
      throw err;
    }
  }

  /** Execute a write query (INSERT, UPDATE, DELETE) outside transaction */
  public async executeWriteQuery<T>(query: string, params: any[] = []): Promise<T[]> {
    try {
      const result: QueryResult = await this.pool.query(query, params);
      return result.rows as T[];
    } catch (err) {
      logger.error('❌ Write query execution failed: %o', err);
      throw err;
    }
  }

  /** Execute a query inside the current transaction */
  public async executeTransactionQuery<T>(query: string, params: any[] = []): Promise<T[]> {
    if (!this.transactionClient) {
      throw new Error('No active transaction client');
    }
    try {
      const result: QueryResult = await this.transactionClient.query(query, params);
      return result.rows as T[];
    } catch (err) {
      logger.error('❌ Transaction query failed: %o', err);
      throw err;
    }
  }
}
