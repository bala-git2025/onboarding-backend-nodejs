import { Request, Router, Response } from 'express';
import { DBManager } from '../arch-layer/database/dbManager';
import { send200, send500, send404, send201, send400 } from '../arch-layer/response/reponse';
import { ManagerRepository } from '../repositories/managerRepository';
import { syslog } from 'winston/lib/winston/config';

const router = Router();
const managerRepository = new ManagerRepository();


/**
 * GET / Managers
 * Fetches all Managers
 */
router.get('/id', async (req: Request, res: Response) => {
    try {
        const teamList = await managerRepository.getAllManagersList();
        send200(res, req.path, { teamList });
    } catch (err) {
        send500(res, req.path, err as Error);
    }
});

/**
 * GET / Managers
 * Fetches all Managers
 */
router.get('/team/:id', async (req: Request, res: Response) => {
    try {
        const teamId = parseInt(req.params.id, 10);
        if (isNaN(Number(req.params.id))) {
            return send400(res, req.path, [{
                fieldName: 'id',
                type: 'bad-request',
                description: 'Invalid Employee Id'
            }]);
        }

        const teamList = await managerRepository.getTeamDetails(teamId);

        if (!teamList || teamList.length === 0) {
            return send404(res, req.path, [{
                fieldName: 'id',
                type: 'not-found',
                description: `Team Not Found with id ${teamId}`
            }]);
        }
        send200(res, req.path, { teamList });
    } catch (err) {
        send500(res, req.path, err as Error);
    }
});

router.post('/addTask', async (req: Request, res: Response) => {
    const { taskId, employeeId, status, poc, dueDate } = req.body;
   console.log(req.body);
    if (!taskId || !employeeId || !status || !poc ) {
        return send400(res, req.path, [{
            fieldName: 'taskId, employeeId, status, poc',
            type: 'bad-request',
            description: 'One or more required fields are missing'
        }]);
    }

    if ((taskId !== undefined && taskId != null && isNaN(Number(taskId)))
        || (employeeId !== undefined && employeeId != null && isNaN(Number(employeeId)))
    ) {
        return send400(res, req.path, [{
            fieldName: 'taskId ',
            type: 'bad-reuest',
            description: 'invalid taskId'
        }]);
    }

    const taskData = {
        ...req.body,
        createdOn: req.body.createdOn || new Date().toISOString(),
        updatedOn: req.body.updatedOn || new Date().toISOString(),
        createdBy: req.body.createdBy || (req as any).user?.id || 'System',
        updatedBy: req.body.updatedBy || (req as any).user?.id || 'System'
    };
    try {
        const newTask = await managerRepository.createTask(taskData);
        send201(res, req.path, { task: newTask });
    } catch (err) {
        if (err instanceof Error && err.message.includes('UNIQUE constraint failed: Employees.email')) {
            return send400(res, req.path, [{
                fieldName: 'email',
                type: 'validation' ,
                description: 'An employee with this email already exists.'
            }]);
        }
        send500(res, req.path, err as Error);
    }
});


export default router;