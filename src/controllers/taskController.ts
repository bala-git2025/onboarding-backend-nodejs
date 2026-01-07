import { Router, Request, Response } from 'express';
import { TaskRepository } from '../repositories/taskRepository';
import { send200, send500, send404, send201, send400 } from '../arch-layer/response/reponse';

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
    if (!req.body.name || !req.body.description || !req.body.category) {
      return send404(res, req.path, [{
        fieldName: 'name, description, category',
        type: 'validation',
        description: 'One or more required fields are missing'
      }]);
    }

    const taskData = {
      ...req.body,
      createdOn: req.body.createdOn || new Date().toISOString(),
      updatedOn: req.body.updatedOn || new Date().toISOString(),
      createdBy: req.body.createdBy || (req as any).user?.id || null,
      updatedBy: req.body.updatedBy || (req as any).user?.id || null
    };

    const newTask = await taskRepo.createTask(taskData);
    send201(res, req.path, { task: newTask });
  }
  catch (err) {
    send500(res, req.path, err as Error);
  }
});

/* 
PUT /tasks/:id
Update an existing Task
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      return send400(res, req.path, [{
        fieldName: 'id',
        type: 'validation',
        description: 'Invalid Task Id format. Must be a number.'
      }]);
    }

    const existingTask = await taskRepo.getTaskById(taskId);
    if (!existingTask) {
      return send404(res, req.path, [{
        fieldName: 'id',
        type: 'not-found',
        description: 'Task Not Found'
      }]);
    }

    const updateData = {
      ...req.body,
      updatedOn: new Date().toISOString(),
      updatedBy: req.body.updatedBy || (req as any).user?.id || existingTask.updatedBy
    };

    const updatedTask = await taskRepo.updateTask(taskId, updateData);

    if (!updatedTask) {
      return send500(res, req.path, new Error('Task update failed for an unknown reason.'));
    }

    send200(res, req.path, { task: updatedTask });
  }
  catch (err) {
    send500(res, req.path, err as Error);
  }
});

/* 
DELETE /tasks/:id
Delete a task by its ID
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      return send400(res, req.path, [{
        fieldName: 'id',
        type: 'validation',
        description: 'Invalid Task Id format. Must be a number.'
      }]);
    }

    const deletedTask = await taskRepo.deleteTask(taskId);

    if (!deletedTask) {
      return send404(res, req.path, [{
        fieldName: 'id',
        type: 'not-found',
        description: 'Task Not Found'
      }]);
    }

    res.status(204).send();
  }
  catch (err) {
    send500(res, req.path, err as Error);
  }
});


export default router;