import { Router, Request, Response } from 'express';
import { TaskCommentsRepository } from '../repositories/taskCommentsRepository';
import { send200, send500 , send400, send404} from '../arch-layer/response/reponse';

const router = Router();
const taskComRepo = new TaskCommentsRepository();

/**
 * GET /tasksComments
 * Fetches all task comments
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const taskComments = await taskComRepo.getAllTaskComments();
    send200(res, req.path, { taskComments });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/**
 * GET /task-comments/:id
 * Fetch all comments for a specific task by its ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const taskIdStr = req.params.id;

    if (!/^\d+$/.test(taskIdStr)) {
      return send400(res, req.path, [{
        fieldName: 'id',
        type: 'bad-request',
        description: 'Invalid Task Id format. Must be a number.'
      }]);
    }

    const taskId = parseInt(taskIdStr, 10);
    const taskComments = await taskComRepo.getTaskCommentsByTaskId(taskId);

    send200(res, req.path, { taskComments: taskComments || [] });

  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

export default router;