import express from 'express';
import cors from "cors";
import environments from './arch-layer/config/config';
import logger from './arch-layer/logger/logger';

// Controllers
import healthController from './controllers/healthController';
import employeeController from './controllers/employeeController';
import taskController from './controllers/taskController';
import taskCommentsController from './controllers/taskCommentsController';
import employeeTaskController from './controllers/employeeTaskController';
import taskEmployeeController from './controllers/taskEmployeeController';
import authController from './controllers/authController';
import { authenticateJWT } from './arch-layer/middleware/authMiddleware';

const app = express();

// Middleware: parse JSON
app.use(express.json());

app.use(cors({ origin: "http://localhost:4000",  credentials: true }));

// Register controllers
app.use('/auth', authController);
app.use('/health', healthController);
app.use('/employees', authenticateJWT, employeeController, employeeTaskController); 
app.use('/tasks', authenticateJWT, taskController, taskEmployeeController); 
app.use('/taskComments', authenticateJWT, taskCommentsController);

const log: any = logger;
log.table = (data: any, msg?: string) => {
  if (msg) {
    log.info(msg);
  }
  if (Array.isArray(data) || typeof data === 'object') {
    console.table(data); // pretty console output
  } else {
    log.info(data);
  }
};

// Start server
const server = app.listen(environments.server.port, () => {
  const line = '─'.repeat(60);
  log.info(`\n${line}`);
  log.info(`🚀 Server Started`);
  log.info(`${line}`);
  log.info(`Environment : ${environments.server.env}`);
  log.info(`Port        : ${environments.server.port}`);
  log.info(`Logger      : level=${environments.logger.level}, console=${environments.logger.console}, file=${environments.logger.file}`);
  log.info(`Database    : type=${environments.db.type}`);
  if (environments.db.type === 'postgres') {
    log.info(`   ↳ host=${environments.db.host}, port=${environments.db.port}, user=${environments.db.user}, db=${environments.db.database}`);
  } else if (environments.db.type === 'sqlite') {
    log.info(`   ↳ file=${environments.db.sqliteFile}`);
  }

  // Print endpoints in table format
  const routes: { path: string; methods: string[] }[] = [];
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).map(m => m.toUpperCase());
      routes.push({ path: middleware.route.path, methods });
    } else if (middleware.name === 'router') {
      const mountPath = middleware.regexp.source
        .replace('^\\', '')
        .replace('\\/?(?=\\/|$)', '')
        .replace('\\', '')
        .replace('?', '');
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods).map(m => m.toUpperCase());
          routes.push({ path: `${mountPath}${handler.route.path}`, methods });
        }
      });
    }
  });

  log.info(`${line}`);
  log.info(`📌 Registered Endpoints:`);
  log.info(`${line}`);
  log.table(routes);
  log.info(`${line}\n`);
});

server.on('error', (err: any) => {
  log.error(
    err.code === 'EADDRINUSE'
      ? 'Port 5000 is already in use.'
      : `Error: ${err}`
  );
  process.exit(1);
});