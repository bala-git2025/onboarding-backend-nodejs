// employeeController.ts
import { Router } from 'express';
import { EmployeeRepository } from '../repositories/employeeRepository';
import { send200, send404, send500 } from '../arch-layer/response/reponse';

const router = Router();
const employeeRepo = new EmployeeRepository();

/**
 * GET /employees
 * Fetch all employees
 */
router.get('/', async (req, res) => {
  try {
    const employees = await employeeRepo.getAllEmployees();
    send200(res, req.path, { employees });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

export default router;