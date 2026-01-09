import { Router, Request, Response } from 'express';
import { EmployeeTaskRepository } from '../repositories/employeeTaskRepository';
import { send200, send201, send500, send404 } from '../arch-layer/response/reponse';
import { DBManager } from '../arch-layer/database/dbManager';

const router = Router();
const employeeTaskRepo = new EmployeeTaskRepository();

/**
 * POST /employees/:employeeId/tasks
 */
router.post('/:employeeId/tasks', async (req: Request, res: Response) => {
  try {
    const employeeId = Number(req.params.employeeId);
    const { taskId, status, poc } = req.body;

    await employeeTaskRepo.assignTask(employeeId, taskId, status, poc);
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
    const tasks = await employeeTaskRepo.getTasksByEmployee(employeeId);
    send200(res, req.path, { tasks });
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

    const dbManager = new DBManager();
    await dbManager.connect();

    const rows = await dbManager.query<{ id: number }>(
      'SELECT id FROM employee_task WHERE employeeId = ? AND taskId = ?',
      [employeeId, taskId]
    );

    if (rows.length === 0) {
      return send404(res, req.path, [{
        fieldName: 'employeeTask',
        type: 'not-found',
        description: 'Employee task mapping not found'
      }]);
    }

    await employeeTaskRepo.updateEmployeeTask(rows[0].id, status, poc);
    send200(res, req.path, { message: 'Employee task updated' });
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

    const dbManager = new DBManager();
    await dbManager.connect();

    const rows = await dbManager.query<{ id: number }>(
      'SELECT id FROM employee_task WHERE employeeId = ? AND taskId = ?',
      [employeeId, taskId]
    );

    if (rows.length === 0) {
      return send404(res, req.path, [{
        fieldName: 'employeeTask',
        type: 'not-found',
        description: 'Employee task mapping not found'
      }]);
    }

    await employeeTaskRepo.removeEmployeeTask(rows[0].id);
    send200(res, req.path, { message: 'Employee task removed' });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

export default router;
