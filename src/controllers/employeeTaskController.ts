import { Router, Request, Response } from 'express';
import { EmployeeTaskRepository } from '../repositories/employeeTaskRepository';
import { send200, send201, send400, send404, send500 } from '../arch-layer/response/reponse';

const router = Router();
const employeeTaskRepo = new EmployeeTaskRepository();

const isValidId = (v: any) => !isNaN(Number(v));

/**
 * POST /employees/:employeeId/tasks
 */
router.post('/:employeeId/tasks', async (req: Request, res: Response) => {
  try {
    const employeeId = Number(req.params.employeeId);
    const { taskId, status, poc } = req.body;

    if (!isValidId(employeeId) || !isValidId(taskId)) {
      return send400(res, req.path, [{
        fieldName: 'employeeId/taskId',
        type: 'validation',
        description: 'Invalid employeeId or taskId'
      }]);
    }

    await employeeTaskRepo.assignTask(employeeId, Number(taskId), status, poc);
    send201(res, req.path, { message: 'Task assigned to employee' });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/**
 * GET /employees/:employeeId/tasks
 */
router.get('/:employeeId/tasks', async (req: Request, res: Response) => {
  try {
    const employeeId = Number(req.params.employeeId);

    if (!isValidId(employeeId)) {
      return send400(res, req.path, [{
        fieldName: 'employeeId',
        type: 'validation',
        description: 'Invalid employeeId'
      }]);
    }

    const tasks = await employeeTaskRepo.getTasksByEmployee(employeeId);
    send200(res, req.path, { tasks });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/**
 * GET /employees/:employeeId/tasks/:taskId
 */
router.get('/:employeeId/tasks/:taskId', async (req: Request, res: Response) => {
  try {
    const employeeId = Number(req.params.employeeId);
    const taskId = Number(req.params.taskId);

    if (!isValidId(employeeId) || !isValidId(taskId)) {
      return send400(res, req.path, [{
        fieldName: 'employeeId/taskId',
        type: 'validation',
        description: 'Invalid employeeId or taskId'
      }]);
    }

    const task = await employeeTaskRepo.getEmployeeTaskDetail(employeeId, taskId);
    if (!task) {
        return send404(res, req.path, [{
            fieldName: 'task',
            type: 'not-found',
            description: 'Task assignment not found'
        }]);
    }

    send200(res, req.path, { task });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/**
 * PUT /employees/:employeeId/tasks/:taskId
 */
router.put('/:employeeId/tasks/:taskId', async (req: Request, res: Response) => {
  try {
    const employeeId = Number(req.params.employeeId);
    const taskId = Number(req.params.taskId);
    const { status, poc } = req.body;

    const employeeTaskId =
      await employeeTaskRepo.getEmployeeTaskId(employeeId, taskId);

    if (!employeeTaskId) {
      return send404(res, req.path, [{
        fieldName: 'employeeTask',
        type: 'not-found',
        description: 'Employee task mapping not found'
      }]);
    }

    await employeeTaskRepo.updateEmployeeTask(employeeTaskId, status, poc);
    send200(res, req.path, { message: 'Employee task updated' });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/**
 * POST /employees/:employeeId/tasks/:taskId/comments
 */
router.post('/:employeeId/tasks/:taskId/comments', async (req: Request, res: Response) => {
  try {
    const employeeId = Number(req.params.employeeId);
    const taskId = Number(req.params.taskId);
    const { comment } = req.body;

    const employeeTaskId = await employeeTaskRepo.getEmployeeTaskId(employeeId, taskId);

    if (!employeeTaskId) {
      return send404(res, req.path, [{
        fieldName: 'employeeTask',
        type: 'not-found',
        description: 'Employee task mapping not found'
      }]);
    }

    const userId = (req as any).user?.id || null;
    await employeeTaskRepo.addComment(employeeTaskId, comment, userId);
    
    send201(res, req.path, { message: 'Comment added' });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/**
 * DELETE /employees/:employeeId/tasks/:taskId
 */
router.delete('/:employeeId/tasks/:taskId', async (req: Request, res: Response) => {
  try {
    const employeeId = Number(req.params.employeeId);
    const taskId = Number(req.params.taskId);

    const employeeTaskId =
      await employeeTaskRepo.getEmployeeTaskId(employeeId, taskId);

    if (!employeeTaskId) {
      return send404(res, req.path, [{
        fieldName: 'employeeTask',
        type: 'not-found',
        description: 'Employee task mapping not found'
      }]);
    }

    await employeeTaskRepo.removeEmployeeTask(employeeTaskId);
    send200(res, req.path, { message: 'Employee task removed' });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

export default router;