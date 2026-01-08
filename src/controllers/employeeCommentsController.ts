import { Router, Request, Response } from 'express';
import { EmployeeCommentsRepository } from '../repositories/employeeCommentsRepository';
import { send200, send500 } from '../arch-layer/response/reponse';

const router = Router();
const employeeComRepo = new EmployeeCommentsRepository();

/**
 * GET /employeeComments
 * Fetches all employee comments
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const employeeComments = await employeeComRepo.getAllEmployeeComments();
    send200(res, req.path, { employeeComments });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

export default router;
