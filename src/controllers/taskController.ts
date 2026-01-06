// taskRoutes.ts
import { Router, Request, Response } from 'express';
import { TaskRepository } from '../repositories/taskRepository';
import { send200, send500, send404, send201 } from '../arch-layer/response/reponse';

const router = Router();
const taskRepo = new TaskRepository();

/**
 * GET /tasks
 * Fetches all tasks
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const tasks = await taskRepo.getAllTasks();
    send200(res, req.path, { tasks });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/* 
GET /tasks/:id
Fetch tasks by task id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id);

    if (isNaN(Number(req.params.id))) {
      return send404(res, req.path, [{
        fieldName: 'id',
        type: 'validation',
        description: 'Invalid Task Id'
      }]);
    }

    const task = await taskRepo.getTaskById(taskId);

    if (!task) {
      return send404(res, req.path, [{
        fieldName: 'id',
        type: 'not-found',
        description: 'Task Not Found'
      }]);
    }

    send200(res, req.path, { task });
  }
  catch (err) {
    send500(res, req.path, err as Error);
  }
});

/* 
POST /tasks
Create a new Task
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate required fields
    if (!req.body.name) {
      return send404(res, req.path, [{
        fieldName: 'name',
        type: 'validation',
        description: 'Task Name is required'
      }]);
    }

    // Add user information if available from authentication
    const taskData = {
      ...req.body,
      // Set createdOn and updatedOn if not provided
      createdOn: req.body.createdOn || new Date().toISOString(),
      updatedOn: req.body.updatedOn || new Date().toISOString(),
      // Set createdBy and updatedBy if not provided but user info is available
      createdBy: req.body.createdBy || (req as any).user?.id || null,
      updatedBy: req.body.updatedBy || (req as any).user?.id || null
    };

    const newTask = await taskRepo.createTask(taskData);
    send201(res, req.path, { task: newTask });
  }
  catch(err) {
    send500(res, req.path, err as Error);
  }
});

export default router;