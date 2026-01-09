import express from 'express';
import environments from './arch-layer/config/config';
import logger from './arch-layer/logger/logger';

// Controllers
import healthController from './controllers/healthController';
import employeeController from './controllers/employeeController';
import taskController from './controllers/taskController';
import taskCommentsController from './controllers/taskCommentsController';
import employeeTaskController from './controllers/employeeTaskController';


const app = express();

// Middleware: parse JSON
app.use(express.json());

// Register controllers
app.use('/health', healthController);
app.use('/employees', employeeController);
app.use('/tasks', taskController);
app.use('/taskComments', taskCommentsController);
app.use('/employeeTasks', employeeTaskController);


// Start server
const server=app.listen(environments.server.port, () => {
  const line = '─'.repeat(60);
  console.log(`\n${line}`);
  console.log(`🚀 Server Started`);
  console.log(`${line}`);
  console.log(`Environment : ${environments.server.env}`);
  console.log(`Port        : ${environments.server.port}`);
  console.log(`Logger      : level=${environments.logger.level}, console=${environments.logger.console}, file=${environments.logger.file}`);
  console.log(`Database    : type=${environments.db.type}`);
  if (environments.db.type === 'postgres') {
    console.log(`   ↳ host=${environments.db.host}, port=${environments.db.port}, user=${environments.db.user}, db=${environments.db.database}`);
  } else if (environments.db.type === 'sqlite') {
    console.log(`   ↳ file=${environments.db.sqliteFile}`);
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

  console.log(`${line}`);
  console.log(`📌 Registered Endpoints:`);
  console.log(`${line}`);
  console.table(routes);
  console.log(`${line}\n`);
});

server.on("error",(err:any)=>{
  console.log(
    err.code==='EADDRINUSE'
    ?"Port 5000 is already in use."
    :`Error: ${err}`
  );
  process.exit(1);
});