import { Router } from 'express';
import os from 'os';
import process from 'process';
import { DBManager } from '../arch-layer/database/dbManager';
import environments from '../arch-layer/config/config';
import { send200, send500 } from '../arch-layer/response/reponse';

const router = Router();
const dbManager = new DBManager();

/**
 * GET /health
 * General server + DB connectivity check
 */
router.get('/', async (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());

  try {
    await dbManager.connect();

    send200(res, req.path, {
      success: true,
      message: 'Server and Database healthy',
      details: {
        environment: process.env.NODE_ENV || 'development',
        uptime: `${uptimeSeconds} seconds`,
        memory: {
          rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        },
        system: {
          hostname: os.hostname(),
          platform: os.platform(),
          arch: os.arch(),
          loadavg: os.loadavg(),
        },
        database: 'Connected',
        dbType: environments.db.type,
      },
    });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/**
 * GET /health/db
 * Detailed database health info
 */
router.get('/db', async (req, res) => {
  try {
    await dbManager.connect();

    if (environments.db.type === 'postgres') {
      const result = await dbManager.query<{ version: string }>('SELECT version()');
      send200(res, req.path, {
        success: true,
        dbType: 'postgres',
        version: result[0]?.version,
        host: environments.db.host,
        port: environments.db.port,
        database: environments.db.database,
      });
    } else {
      const result = await dbManager.query<{ version: string }>('SELECT sqlite_version() as version');
      send200(res, req.path, {
        success: true,
        dbType: 'sqlite',
        version: result[0]?.version,
        file: environments.db.sqliteFile,
      });
    }
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

export default router;
