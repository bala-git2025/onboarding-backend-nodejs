import { Router, Request, Response } from 'express';
import { TaskEmployeeRepository } from '../repositories/taskEmployeeRepository';
import { send200, send201, send500, send404, send400 } from '../arch-layer/response/reponse';

const router = Router();
const taskEmployeeRepo = new TaskEmployeeRepository();

router.get('/:taskId/employees', async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.taskId);

    if (isNaN(taskId)) {
      return send400(res, req.path, [{
        fieldName: 'taskId',
        type: 'invalid',
        description: 'Task ID must be a number'
      }]);
    }

    const taskExists = await taskEmployeeRepo.checkTaskExists(taskId);
    if (!taskExists) {
      return send404(res, req.path, [{
        fieldName: 'task',
        type: 'not-found',
        description: 'Task not found'
      }]);
    }

    const employees = await taskEmployeeRepo.getEmployeesByTask(taskId);
    send200(res, req.path, { employees });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

router.post('/:taskId/employees', async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.taskId);
    const { employeeId, status, poc } = req.body;

    if (isNaN(taskId)) {
      return send400(res, req.path, [{
        fieldName: 'taskId',
        type: 'invalid',
        description: 'Task ID must be a number'
      }]);
    }

    if (!employeeId || isNaN(Number(employeeId))) {
      return send400(res, req.path, [{
        fieldName: 'employeeId',
        type: 'invalid',
        description: 'A valid employee ID is required'
      }]);
    }

    const taskExists = await taskEmployeeRepo.checkTaskExists(taskId);
    if (!taskExists) {
      return send404(res, req.path, [{
        fieldName: 'task',
        type: 'not-found',
        description: 'Task not found'
      }]);
    }

    const employeeExists = await taskEmployeeRepo.checkEmployeeExists(employeeId);
    if (!employeeExists) {
      return send404(res, req.path, [{
        fieldName: 'employee',
        type: 'not-found',
        description: 'Employee not found'
      }]);
    }

    const assignmentExists = await taskEmployeeRepo.checkAssignmentExists(taskId, employeeId);
    if (assignmentExists) {
      return send400(res, req.path, [{
        fieldName: 'assignment',
        type: 'duplicate',
        description: 'Employee is already assigned to this task'
      }]);
    }

    const userId = (req as any).user?.id || null;
    const assignment = await taskEmployeeRepo.assignEmployeeToTask(taskId, employeeId, status, poc, userId, userId);

    send201(res, req.path, { message: 'Employee assigned to task', assignment });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

export default router;