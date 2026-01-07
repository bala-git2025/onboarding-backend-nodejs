import { Router, Request, Response } from 'express';
import { TaskCommentsRepository } from '../repositories/taskCommentsRepository';
import { send200, send500 } from '../arch-layer/response/reponse';

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

export default router;